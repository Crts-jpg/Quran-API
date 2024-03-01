var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const  db = require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/bookmark/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const bookmark = await prisma.bookmark.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        res.json(bookmark);
    } catch (error) {
        console.error("Error fetching bookmark: ",error);
        res.status(500).json({ error: 'Error fetching bookmark' });
    }
});

app.post('/bookmark', async (req, res) => {
    const { surahId, ayatId } = req.body;
    try {
        const bookmark = await prisma.bookmark.create({
            data: {
                surahId: parseInt(surahId),
                ayatId: parseInt(ayatId),
            },
        });
        res.json(bookmark);
    } catch (error) {
        console.error("Error creating bookmark: ",error);
        res.status(500).json({ error: 'Error creating bookmark' });
    }
});

app.delete('/bookmark/:id', async (req, res) => {
    const { id } = req.params;
    try {
     await prisma.bookmark.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.json({ success: 'Bookmark deleted successfully' });
    }catch (error) {
        console.error("Error deleting bookmark: ",error);
        res.status(500).json({ error: 'Error deleting bookmark' });
    }
});




app.get('/db', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM surah');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});

module.exports = app;
