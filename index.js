function initHeaderAnimation() {
    let names = document.querySelectorAll('.name');

    const colors = [
        '#FAD02E', // Light Yellow
        '#FFC0CB', // Light Pink
        '#ADD8E6', // Light Blue
        '#90EE90', // Light Green
        '#FFA07A', // Light Salmon
        '#FFB6C1', // Light Pink
        '#E6E6FA', // Lavender
        '#FFFACD', // Lemon Chiffon
        '#D3D3D3', // Light Gray
        '#F0E68C', // Khaki
        '#E0FFFF', // Light Cyan
        '#FAFAD2'  // Light Goldenrod Yellow
    ];

    // Loop through each name and assign a different color
    names.forEach((nameDiv, index) => {
        // Assign the color from the colors array, loop back if more names than colors
        nameDiv.style.color = colors[index % colors.length];
    });

    // Create a master timeline for sequential animations with repeat
    const masterTimeline = gsap.timeline({ repeat: -1 }); // Endless loop

    // Create a function to animate each name and then fade it out
    function animateName(nameDiv) {
        // Select all the letter spans inside the name div (both first and last name letters)
        const letters = nameDiv.querySelectorAll('div');

        // Create a timeline for the name
        const tl = gsap.timeline();

        // First, hide all names except the current one
        tl.set(names, { opacity: 0, display: 'none' }); // Hide all other names

        // Show the current name
        tl.set(nameDiv, { display: 'flex', opacity: 1 }); // Make the current name visible

        // Animate each letter in the name with a delay between them
        letters.forEach((letter, index) => {
            tl.fromTo(letter, 
                { opacity: 0, y: -100 },   // Start from higher position for a stronger bounce
                { opacity: 1, y: 0 },      // Animate to the normal position
                index * 0.5               // Slower delay between each letter
            );
        });

        // Once the name is fully displayed, wait 2 seconds, then fade it out
        tl.to(nameDiv, { opacity: 0, duration: 1 }, "+=2")
          .set(nameDiv, { display: 'none' }); // Hide the name after it fades out

        return tl;
    }

    // Loop through each name in the NodeList and add to master timeline
    names.forEach((nameDiv) => {
        // Add the animation for each name to the master timeline
        masterTimeline.add(animateName(nameDiv));
    });
}


/*I modified this to include a drawCanvas function and an event listener on window resize so that the particle text will redraw in the center when the window is resized.

I also extracted some of the data that I wanted to play with into variables at the top so that I
could play with them more easily.

I would really like to figure out how to make the particles fade from being masked by the text 
into being masked by the background and have the two sort of replace eachother in contrast.
*/
var title_name = 'Univariate Analysis II',
    title_base_color = '#333333',
	  particle_colors = ['#FF5E4C ', '#ED413C', '#5E4CFF'],
    effect = 1;
	 

var particles = [],
	frequency = 1,
	c1 = {},
	c2 = {},
	c3 = {},
	tela, 
  canvas;

var btn = document.querySelector('.title h3');
var body = document.querySelector('body');
setInterval(function () {populate()}.bind(this), frequency);
drawCanvas();
update();
//fadeOut();

/* Event listeners */
function fadeOut(){
  setTimeout(function(){
    var c = document.querySelector('canvas');
    if ( c ){ 
      c.style.opacity = 0;
      c.style.fontSize = '26px';
      body.style.backgroundColor = '#FFFFFF';
      faded = true;
    }
  }, 5000);
}

btn.addEventListener('click',function(){changeEffect()});

window.addEventListener('resize', function () { 
 //if ( !faded ){
    body.style.backgroundColor = '#000000'; 
    drawCanvas();
  //}
});

/* Functions */
function drawCanvas() {
	var dom_canvas = document.querySelector('canvas');
	if (dom_canvas) dom_canvas.remove();
	var ht = window.innerHeight;
	var wd = window.innerWidth;
	c1 = createCanvas({width: wd,height: ht});
	c2 = createCanvas({width: wd,height: ht});
	c3 = createCanvas({width: wd,height: ht});
	tela = c1.canvas;
	canvas = c1.context;
	body.appendChild(c3.canvas);
	writeText(c2.canvas, c2.context, title_name);
}

function changeEffect(){
  effect += 1;
  setTimeout(function(){effect+=1}, 5000);
  setTimeout(function(){effect=1; drawCanvas()}, 7000);
}
/* Codepen code ... with a few modifications */
var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ('value ' in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}
	return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
}();

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError('Cannot call a class as a function');
	}
}

var Particle = function () {
	function Particle(canvas, options) {
		_classCallCheck(this, Particle);
		var random = Math.random();
		this.canvas = canvas;
		this.x = options.x;
		this.y = options.y;
		this.s = 3 + Math.random();
		this.a = 0;
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		this.radius = 0.5 + Math.random() * 20;
		this.color = this.randomColor();
	}
	_createClass(Particle, [{
		key: 'randomColor',
		value: function randomColor() {
			var colors = particle_colors;
			return colors[this.randomIntFromInterval(0, colors.length - 1)];
		}
	}, {
		key: 'randomIntFromInterval',
		value: function randomIntFromInterval(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
	}, {
		key: 'render',
		value: function render() {
			this.canvas.beginPath();
			this.canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
			this.canvas.lineWidth = 2;
			this.canvas.fillStyle = this.color;
			this.canvas.fill();
			this.canvas.closePath();
		}
	}, {
		key: 'move',
		value: function move() {
			this.x += Math.cos(this.a) * this.s;
			this.y += Math.sin(this.a) * this.s;
			this.a += Math.random() * 0.8 - 0.4;
			if (this.x < 0 || this.x > this.w - this.radius) {
				return false;
			}
			if (this.y < 0 || this.y > this.h - this.radius) {
				return false;
			}
			this.render();
			return true;
		}
	}]);
	return Particle;
}();

function createCanvas(properties) {
	var canvas = document.createElement('canvas');
	canvas.width = properties.width;
	canvas.height = properties.height;
	var context = canvas.getContext('2d');
	return {
		canvas: canvas,
		context: context
	};
}

function writeText(canvas, context, text) {
	var size = 100;
	context.font = size + 'px Montserrat';
	context.fillStyle = title_base_color;
	context.textAlign = 'center';
  context.transition = 'all 2s ease-in-out';
	var lineheight = 70;
	var lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		context.fillText(lines[i], canvas.width / 2, canvas.height / 2 + lineheight * i - lineheight * (lines.length - 1) / 3);
	}
}

function maskCanvas() {
	c3.context.drawImage(c2.canvas, 0, 0, c2.canvas.width, c2.canvas.height);
  switch ( effect ) {
    case 1 : c3.context.globalCompositeOperation = 'source-atop'; break;
    case 2 : c3.context.globalCompositeOperation = 'source-out' ; break;
    case 3 : c3.context.globalCompositeOperation = 'screen'; break;
    default : c3.context.globalCompositeOperation = 'source-atop'
  };
	c3.context.drawImage(c1.canvas, 0, 0);
	blur(c1.context, c1.canvas, 2);
}

function blur(ctx, canvas, amt) {
	ctx.filter = 'blur(' + amt + 'px)';
	ctx.drawImage(canvas, 0, 0);
	ctx.filter = 'none';
}

function populate() {
	particles.push(new Particle(canvas, {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}));
	return particles.length;
}

function clear() {
	canvas.globalAlpha = 0.03;
	canvas.fillStyle = title_base_color;
	canvas.fillRect(0, 0, tela.width, tela.height);
	canvas.globalAlpha = 1;
}

function update() {
	clear();
	particles = particles.filter(function (p) {return p.move();});
	maskCanvas();
	requestAnimationFrame(update.bind(this));
}

let tl = gsap.timeline();


//look at fixes in the Pen https://codepen.io/ghaste/pen/OJqLbvg
//for adding mouse trail to a page that scrolls beyond the viewport, as would be the case with most websites - lol
let x1=0, y1=0;
window.client
const 
  vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
  dist_to_draw = 50,
  delay = 1000,
  fsize = [
    '1.1rem', '1.4rem', '.8rem', '1.7rem'
  ],
  colors = [
  '#E23636',
  '#F9F3EE',
  '#E1F8DC',
  '#B8AFE6',
  '#AEE1CD',
  '#5EB0E5'
],
  rand = (min, max) => 
    Math.floor(Math.random() * (max - min + 1)) + min,
  selRand = (o) => o[rand(0, o.length -1)],
  distanceTo =  (x1, y1, x2, y2) => 
    Math.sqrt((Math.pow(x2-x1,2))+(Math.pow(y2-y1,2))),
  shouldDraw = (x, y) => 
    (distanceTo(x1, y1, x, y) >= dist_to_draw),
  addStr = (x, y) => {
    const str = document.createElement("div");
    str.innerHTML = '&#10022;';
    str.className = 'star';
    str.style.top = `${y + rand(-20,20)}px`;
    str.style.left = `${x}px`;
    str.style.color = selRand(colors);
    str.style.fontSize = selRand(fsize);
    document.body.appendChild(str);
    //console.log(rand(0, 3));
    const fs = 10 + 5 * parseFloat(getComputedStyle(str).fontSize);
    //console.log(vh, y, fs);
    //console.log((y+fs)>vh?vh-y:fs);
    str.animate({
      translate: `0 ${(y+fs)>vh?vh-y:fs}px`,
      opacity: 0,
      transform: `rotateX(${rand(1, 500)}deg) rotateY(${rand(1, 500)}deg)`
    }, {
      duration: delay,
      fill: 'forwards',

    });
    //could add a animation terminate listener, but why add the additional load
    setTimeout(() => {
        str.remove();
      }, delay);
  }

addEventListener("mousemove", (e) => {
  const {clientX, clientY} = e;
  if(shouldDraw(clientX, clientY)){
    addStr(clientX, clientY);
    x1 = clientX;
    y1 = clientY;
  }
});


tl.fromTo('.title h3', {opacity: 0}, {opacity: 1, duration: 5, ease: 'none'}, '<')
.to('.title h3', {opacity:0,duration:2,ease: 'none'}, '>')
.to('canvas', {opacity: 0, duration:1}, '>')
.set('canvas', {display: 'none'}, '>')
.to('body', {backgroundImage: 'radial-gradient( ellipse at top center, #310038 0%, #000000 100%)', backgroundSize:'cover' ,ease: 'none', duration: 3}, '>+1')
.set('.scroller', {display: 'flex'}, '<')
.to('.scroller ol', {opacity:1, duration: 2, ease: 'none'}, '<')
// After the title animation is done, start the header animation
.set('.header', {display: 'flex', onComplete: initHeaderAnimation()}, '>')
.fromTo('.header', {opacity: 0}, {opacity: 1, duration: 2, ease: 'none'}, '<');



let scroller = document.querySelectorAll('.scroller ol li');
console.log(scroller);

scroller = Array.from(scroller);

scroller.forEach((el, i) => {
	// When Clicked I want an html path to open in a new tab
	el.addEventListener('click', () => {
		window.open(el.dataset.url, '_blank');
	});
});

// Calculate header height and add it to the top padding of scroller + 1 rem
let headerHeight = document.querySelector('.header').offsetHeight;
document.querySelector('.scroller').style.paddingTop = headerHeight + 100 + 'px';
