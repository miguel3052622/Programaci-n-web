// set up canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Ball {
   constructor(x, y, velX, velY, color, size) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
      this.color = color;
      this.size = size;
   }

   draw() {
      // Crear una nueva imagen
      let img = new Image();
      // Establecer la ruta de la imagen para cada bola
      img.src = 'pajaro2.png';
      
      // Dibujar la imagen cuando se cargue completamente
      img.onload = () => {
          // Dibujar la imagen en la posición de la bola
          ctx.drawImage(img, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
      };
  }
   update() {
      if ((this.x + this.size) >= width) {
         this.velX = -(Math.abs(this.velX));
      }

      if ((this.x - this.size) <= 0) {
         this.velX = Math.abs(this.velX);
      }

      if ((this.y + this.size) >= height) {
         this.velY = -(Math.abs(this.velY));
      }

      if ((this.y - this.size) <= 0) {
         this.velY = Math.abs(this.velY);
      }

      this.x += this.velX;
      this.y += this.velY;
   }

   collisionDetect() {
      for (const ball of balls) {
         if (!(this === ball)) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
         }
      }
   }
}

const balls = [];

while (balls.length < 25) {
   const size = random(10,20);
   const ball = new Ball(
      random(0 + size,width - size),
      random(0 + size,height - size),
      random(-7,7),
      random(-7,7),
      randomRGB(),
      size
   );

  balls.push(ball);
}

// Agregar evento de clic al lienzo (canvas)
canvas.addEventListener('click', function(event) {
    // Iterar sobre todas las bolas
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        // Verificar si la posición del clic está dentro de una bola
        if (event.clientX >= ball.x - ball.size && 
            event.clientX <= ball.x + ball.size && 
            event.clientY >= ball.y - ball.size && 
            event.clientY <= ball.y + ball.size) {
                
            // Agregar tres nuevas bolas
            for (let j = 0; j < 3; j++) {
                const newSize = ball.size;
                const newBall = new Ball(
                    ball.x, // Misma posición que la bola original
                    ball.y, // Misma posición que la bola original
                    random(-7,7), // Velocidad aleatoria
                    random(-7,7), // Velocidad aleatoria
                    ball.color, // Mismo color que la bola original
                    newSize // Mismo tamaño que la bola original
                );
                balls.push(newBall); // Agregar la nueva bola al arreglo
            }
            break; // Detener el ciclo después de procesar la bola actual
        }
    }
});

function loop() {
   ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
   ctx.fillRect(0, 0,  width, height);

   for (const ball of balls) {
     ball.draw();
     ball.update();
     ball.collisionDetect();
   }

   requestAnimationFrame(loop);
}

loop();
