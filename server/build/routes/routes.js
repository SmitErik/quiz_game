"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const User_1 = require("../model/User");
const Quiz_1 = require("../model/Quiz");
const configureRoutes = (passport, router) => {
    /*****************************AUTHORIZATION***************************************/
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.error(error);
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('Ez a felhasználó nem található.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Belső szerver hiba.');
                        }
                        else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    router.post('/register', (req, res) => {
        new User_1.User({
            email: req.body.email,
            password: req.body.password,
            nickname: req.body.nickname,
            score: JSON.parse(req.body.score),
            finishedQuizzes: JSON.parse(req.body.finishedQuizzes)
        }).save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            if (error.code === 11000) {
                res.status(400).send('Ilyen e-mail címmel regisztrált játékos már létezik.');
            }
            else {
                res.status(500).send('Belső szerver hiba.');
            }
        });
    });
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Belső szerver hiba.');
                }
                res.status(200).send('Sikeres kijelentkezés.');
            });
        }
        else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    /********************************USERS********************************************/
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            User_1.User.find().then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            });
        }
        else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });
    router.get('/getUser', (req, res) => {
        if (req.isAuthenticated()) {
            User_1.User.findById({ _id: req.query.id }).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            });
        }
        else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });
    router.get('/getAllUserNames', (req, res) => {
        if (req.isAuthenticated()) {
            User_1.User.aggregate([{
                    $project: {
                        _id: 0,
                        nickname: 1,
                        score: 1,
                        quizzesCount: { $size: '$finishedQuizzes' }
                    }
                }
            ]).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            });
        }
        else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });
    router.delete('/deleteUser', (req, res) => {
        if (req.isAuthenticated()) {
            User_1.User.findById({ _id: req.query.id }).then(data => {
                User_1.User.deleteOne({ _id: req.query.id }).then(_ => {
                    res.status(200).send(data);
                }).catch(error => {
                    console.error(error);
                    res.status(500).send('Belső szerver hiba.');
                });
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            });
        }
        else {
            res.status(500).send('A felhasználó nincs bejelentkezve.');
        }
    });
    /********************************QUIZZES*******************************************/
    router.get('/getAllQuizzes', (_, res) => {
        Quiz_1.Quiz.find().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        });
    });
    router.get('/getQuiz', (req, res) => {
        Quiz_1.Quiz.findById({ _id: req.query.id }).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        });
    });
    router.get('/getAllQuizTitles', (_, res) => {
        Quiz_1.Quiz.aggregate([{
                $project: {
                    _id: 1,
                    title: 1,
                    questionCount: { $size: '$questions' }
                }
            }
        ]).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        });
    });
    router.put('/updateQuiz', (req, res) => {
        const quiz = {
            title: req.body.title,
            questions: JSON.parse(req.body.questions),
            answers1: JSON.parse(req.body.answers1),
            answers2: JSON.parse(req.body.answers2),
            answers3: JSON.parse(req.body.answers3),
            answers4: JSON.parse(req.body.answers4),
            correctAnswers: JSON.parse(req.body.correctAnswers)
        };
        Quiz_1.Quiz.findByIdAndUpdate(req.query.id, quiz, { new: true }).then(data => {
            res.status(200).send(data);
        }).catch(error => {
            console.error(error);
            if (error.code === 11000) {
                res.status(400).send('Ilyen című kvíz már létezik.');
            }
            else {
                res.status(500).send('Belső szerver hiba.');
            }
        });
    });
    router.post('/createQuiz', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let title = req.body.title;
        let counter = 0;
        const quiz = new Quiz_1.Quiz({
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
                const savedQuiz = yield quiz.save();
                res.status(200).send(savedQuiz);
                break;
            }
            catch (error) {
                if (error.code === 11000) {
                    title = incrementTitle(req.body.title, ++counter);
                }
                else {
                    console.error(error);
                    res.status(500).send('Belső szerver hiba.');
                    break;
                }
            }
        }
    }));
    router.delete('/deleteQuiz', (req, res) => {
        Quiz_1.Quiz.findById({ _id: req.query.id }).then(data => {
            Quiz_1.Quiz.deleteOne({ _id: req.query.id }).then(_ => {
                res.status(200).send(data);
            }).catch(error => {
                console.error(error);
                res.status(500).send('Belső szerver hiba.');
            });
        }).catch(error => {
            console.error(error);
            res.status(500).send('Belső szerver hiba.');
        });
    });
    return router;
};
exports.configureRoutes = configureRoutes;
function incrementTitle(title, counter) {
    const matches = title.match(/^(.*?)(\d+)$/);
    if (matches && matches.length === 3) {
        const prefix = matches[1];
        const suffix = parseInt(matches[2]);
        return `${prefix}${suffix + counter}`;
    }
    else {
        return `${title} ${counter}`;
    }
}
