const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
//console.log(c)

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = canvas.height / 23 // создали статическое значение ширины и высоты границы
    static height = canvas.height / 23
    constructor({ position, image }) { //square
        this.position = position
        this.width = canvas.height / 40
        this.height = canvas.height / 40

        this.image = image
    }

    draw() {
        // c.fillStyle = 'green'
        // c.fillRect(this.position.x, this.
        // position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player { //packman
    constructor ({
        position,
        velocity }) {
        this.position = position 
        this.velocity = velocity //speed
        this. radius = 12 //увеличили радиус самого пакмана (до этого был 10) !! ПОДУМАТЬ КАК СДЕЛАТЬ АДАПТИВНОСТЬ
    }

    draw() { //создаём дугу - круг - пакман
        c.beginPath()
        c.arc (this.position.x, this.position.y, this.radius,
        0, Math.PI * 2)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw() //вызываем предыдущий код с драв
        this.position.x += this.velocity.x //каждый раз мы просто добавляем к скорости игрока х или у
        this.position.y += this.velocity.y
    }
}

class Pellet { //food
    constructor ({position }) {
        this.position = position 
        this. radius = 2 //увеличили радиус самого пакмана (до этого был 10) !! ПОДУМАТЬ КАК СДЕЛАТЬ АДАПТИВНОСТЬ
    }

    draw() { //создаём дугу - круг - пакман
        c.beginPath()
        c.arc (this.position.x, this.position.y, this.radius,
        0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

const pellets = []
const  boundaries = [] 
const player = new Player ({
    position: {
        x: Boundary.width + Boundary.width * 3 , //ширина границы + 1\2 ширины границы = серидина границы 
        y: Boundary.height + Boundary.height * 2
    },
    velocity: {
        x:0,
        y:0
    }
})

// создаём переменные букв (кнопок) - определяет, какие кнопки нажимаются
const keys = {
    w: {
        pressed: false //нажата w  по умолчанию ? - нет - false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey = "" //установили последнюю нажатую кнопку, чтобы ничего не паехалоо, как моя крыша

const map = [
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' '],
    [' ', ' ', '-', '+', '+', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '+', '+', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '-', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '-', '-', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '-', '-', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '-', '-', '.', '.', '-', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '-', '-', '-', '-', '-', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '-', '.', '.', '-', '-', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '-', '-', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '-', '-', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '-', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', ' ', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
]
    //генерация каждого нового квадрата + мы перенесли карту для облегчения кода

//создаём картинку к границам не вызывая её каждый раз, а с помощью ретёрна
function creatImage(src) {
    const image = new Image () //вставили картинку !!source = src!!
    image.src = src
    return image
}

map.forEach((row, i) => { //i представляет в какой строке мы находимся в данный момент нашего цикла (индекс)
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: creatImage ('./img/lil.png')
                    })
                )
                break
            case '.': //создаём еду для пакмана -- массив
                pellets.push (
                    new Pellet ({
                        position: {
                            x: j * Boundary.width + Boundary.width / 1.5,
                            y: i * Boundary.height + Boundary.height / 1.5
                        }
                    })
                ) 
                break
        }
    })
})

function circleCollidesWithRectangle ({
    circle,
    rectangle
}) { //столкновение круга и треугольника
    return(
        circle.position.y - circle.radius + circle.velocity.y 
        <= 
        rectangle.position.y + rectangle.height && 
        circle.position.x + circle.radius + circle.velocity.x 
        >= 
        rectangle.position.x && 
        circle.position.y + circle.radius +  circle.velocity.y 
        >= 
        rectangle.position.y && 
        circle.position.x - circle.radius + circle.velocity.x 
        <= 
        rectangle.position.x + rectangle.width   
    )
}

//создаём зацикленную анимацию, чтобы пакман двигался
function animate() {
    requestAnimationFrame(animate) 
    //будет анимировать пкамана пока мы не скажем ему делать движения иначе
    c.clearRect(0, 0, canvas.width, canvas.height) //чтобы не было хвостика за пакманом
    
    // цикл анимации скорости
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) { //i -- итератор; добавляем 1 к i, пока она не станет больше длинны границ
            const boundary = boundaries [i]
            if (
            circleCollidesWithRectangle({
                circle: {
                    ...player, 
                    velocity: {
                        x: 0,
                        y: -5
                }
                }, //многоточие -- spread
                rectangle: boundary
            })
        ) {
            player.velocity.y = 0
            break
        } else {
            player.velocity.y = -5
        }
        }

    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) { //i -- итератор; добавляем 1 к i, пока она не станет больше длинны границ
            const boundary = boundaries [i]
            if (
            circleCollidesWithRectangle({
                circle: {
                    ...player, 
                    velocity: {
                        x: -5, //боковушка
                        y: 0
                }
                }, //многоточие -- spread
                rectangle: boundary
            })
        ) {
            player.velocity.x = 0
            break
        } else {
            player.velocity.x = -5 //идём влево, когда нажимаем клавишу а
        }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) { //i -- итератор; добавляем 1 к i, пока она не станет больше длинны границ
            const boundary = boundaries [i]
            if (
            circleCollidesWithRectangle({
                circle: {
                    ...player, 
                    velocity: {
                        x: 0,
                        y: 5
                }
                }, //многоточие -- spread
                rectangle: boundary
            })
        ) {
            player.velocity.y = 0
            break
        } else {
            player.velocity.y = 5
        }
        }

    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) { //i -- итератор; добавляем 1 к i, пока она не станет больше длинны границ
            const boundary = boundaries [i]
            if (
            circleCollidesWithRectangle({
                circle: {
                    ...player, 
                    velocity: {
                        x: 5,
                        y: 0
                }
                }, //многоточие -- spread
                rectangle: boundary
            })
        ) {
            player.velocity.x = 0
            break
        } else {
            player.velocity.x = 5
        }
        }
    }

    pellets.forEach((pellet) => {
        pellet.draw()
    })

    boundaries.forEach((boundary) => {
        boundary.draw()

        //распознаём барьеры, перпятствия 
        //пересекается ли одна из границ с нашим игроком?
        //сравниваем сторону грока со сторонами границы 
        //если верхняя часть игрока меньше точки, где проходит нижняя граница кубика - эти две тчк равны
        if (
            circleCollidesWithRectangle({
                circle: player,
                rectangle: boundary
            })
            // player.position.y - player.radius + player.velocity.y 
            // <= 
            // boundary.position.y + boundary.height && 
            // player.position.x + player.radius + player.velocity.x 
            // >= 
            // boundary.position.x && 
            // player.position.y + player.radius +  player.velocity.y 
            // >= 
            // boundary.position.y && 
            // player.position.x - player.radius + player.velocity.x 
            // <= 
            // boundary.position.x + boundary.width
        ) {
            //console.log('we are colliding')
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update () //раньше здесь было player.draw (), но за дров теперь отвечает апдейт тк скорость игрока каждый раз увеличивается
    //player.velocity.x = 0
    //player.velocity.y = 0
    
}

animate()

//прослушиватели событий (считываем нажатие кнопки)
//позже установим скорость в цикле анимации (?)
//убрали скорость тк теперь оно само определяем правда ли, что кнопка нажата или нет
addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w' //предопределение последней нажатой клавиши, чтобы ничего не поехало
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }

})

//keyup -- чтобы  он не двигался бесконечно по диагонали прописываем скорость на нулях
//убрали скорость как и в кейдаун тк если кнопка не нажата - не проигрываем
addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            //player.velocity.y = 0
            break
        case 'a':
            keys.a.pressed = false
            //player.velocity.x = 0
            break
        case 's':
            keys.s.pressed = false
            //player.velocity.y = 0
            break
        case 'd':
            keys.d.pressed = false
            //player.velocity.x = 0
            break
    }


})