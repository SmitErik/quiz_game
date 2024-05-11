import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { Quiz } from '../model/Quiz';
import { MongoError } from 'mongodb';


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    /*****************************AUTHORIZATION***************************************/

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.error(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('Ez a felhasználó nem található.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Belső szerver hiba.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        new User({
            email: req.body.email,
            password: req.body.password,
            nickname: req.body.nickname,
            score: JSON.parse(req.body.score),
            finishedQuizzes: JSON.parse(req.body.finishedQuizzes)
        }).save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            if ((error as MongoError).code === 11000) {
                res.status(400).send('Ilyen e-mail címmel regisztrált játékos már létezik.');
            } else {
                res.status(500).send('Belső szerver hiba.');
            }
        })
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Belső szerver hiba.');
                }
                res.status(200).send('Sikeres kijelentkezés.');
            })
        } else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });

    router.get('/checkAuth', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    /********************************USERS********************************************/

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            User.find().then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            })
        } else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });

    router.get('/getUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            User.findById({_id: req.query.id}).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            })
        } else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });
    
    router.get('/getAllUserNames', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            User.aggregate([{
                $project: {
                    _id: 0,
                    nickname: 1,
                    score: 1,
                    quizzesCount: { $size: '$finishedQuizzes' }
                }}
            ]).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            })
        } else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });

    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            User.findById({_id: req.query.id}).then(data => {
                User.deleteOne({_id: req.query.id}).then(_ => {
                    res.status(200).send(data);
                }).catch(error => {
                    console.error(error);
                    res.status(500).send('Belső szerver hiba.');
                })
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            })
        } else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });

    /********************************QUIZZES*******************************************/

    router.get('/getAllQuizzes', (_, res: Response) => {
        Quiz.find().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        })
    });

    router.get('/getQuiz', (req: Request, res: Response) => {
        Quiz.findById({_id: req.query.id}).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        })
    });
    
    router.get('/getAllQuizTitles', (_, res: Response) => {
        Quiz.aggregate([{
            $project: {
                _id: 1,
                title: 1,
                questionCount: { $size: '$questions' }
            }}
        ]).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        })
    });

    router.put('/updateQuiz', (req: Request, res: Response) => {
        const quiz = {
            title: req.body.title,
            questions: JSON.parse(req.body.questions),
            answers1: JSON.parse(req.body.answers1),
            answers2: JSON.parse(req.body.answers2),
            answers3: JSON.parse(req.body.answers3),
            answers4: JSON.parse(req.body.answers4),
            correctAnswers: JSON.parse(req.body.correctAnswers)
        };
        Quiz.findByIdAndUpdate(req.query.id, quiz, {new: true}).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            if ((error as MongoError).code === 11000) {
                res.status(400).send('Ilyen című kvíz már létezik.');
            } else {
                res.status(500).send('Belső szerver hiba.');
            }
        })
    });

    router.post('/createQuiz', async (req: Request, res: Response) => {
        let title = req.body.title;
        let counter = 0;
        const quiz = new Quiz({
            title: title,
            questions: JSON.parse(req.body.questions),
            answers1: JSON.parse(req.body.answers1),
            answers2: JSON.parse(req.body.answers2),
            answers3: JSON.parse(req.body.answers3),
            answers4: JSON.parse(req.body.answers4),
            correctAnswers: JSON.parse(req.body.correctAnswers)
        });
        
        while (true) {
            try {
                quiz.title = title;
                const savedQuiz = await quiz.save();
                res.status(200).send(savedQuiz);
                break;
            } catch (error) {
                if ((error as MongoError).code === 11000) {
                    title = incrementTitle(req.body.title, ++counter);
                } else {
                    console.error(error);
                    res.status(500).send('Belső szerver hiba.');
                    break;
                }
            }
        }
    });

    router.delete('/deleteQuiz', (req: Request, res: Response) => {
        Quiz.findById({_id: req.query.id}).then(data => {
            Quiz.deleteOne({_id: req.query.id}).then(_ => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            })
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        })
    });

    return router;
}


function incrementTitle(title: string, counter: number): string {
    const matches = title.match(/^(.*?)(\d+)$/);
    if (matches && matches.length === 3) {
        const prefix = matches[1];
        const suffix = parseInt(matches[2]);
        return `${prefix}${suffix + counter}`;
    } else {
        return `${title} ${counter}`;
    }
}