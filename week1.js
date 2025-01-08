function clampBuilder( minWidthPx, maxWidthPx, minFontSize, maxFontSize ) {
  const root = document.querySelector( "html" );
  const pixelsPerRem = Number( getComputedStyle( root ).fontSize.slice( 0,-2 ) );
  const minWidth = minWidthPx / pixelsPerRem;
  const maxWidth = maxWidthPx / pixelsPerRem;
  const slope = ( maxFontSize - minFontSize ) / ( maxWidth - minWidth );
  const yAxisIntersection = -minWidth * slope + minFontSize
  return `clamp( ${ minFontSize }rem, ${ yAxisIntersection }rem + ${ slope * 100 }vw, ${ maxFontSize }rem )`;
}


let named = document.querySelector( ".name" );
let title = document.querySelector( ".title" );
let sectionHeader = document.querySelectorAll( ".section > h2" );
let sectionPara = document.querySelectorAll( ".section > p" );
let codes = document.querySelectorAll( "pre" );
let subHeadings = document.querySelectorAll( ".section > h3" );
let sections = document.querySelectorAll( ".sections > div" );
let contentPages = document.querySelectorAll( ".section" );
named.style.fontSize = clampBuilder(300, 1400, 1.5, 2.5);
title.style.fontSize = clampBuilder(300, 1400, 2, 4.5);

sectionHeader.forEach((header) => {
  header.style.fontSize = clampBuilder(300, 1400, 1.5, 2);
});
sectionPara.forEach((para) => {
  para.style.fontSize = clampBuilder(300, 1400, 1, 1.25);
});
subHeadings.forEach((sub) => {
  sub.style.fontSize = clampBuilder(300, 1400, 1.25, 1.5);
});
codes.forEach((block) => {
  // Remove extra spaces after newline characters
  block.textContent = block.textContent.replace(/(?<=\n)\s+/g, '');

  // Replace explicit "\br" with actual newline characters
  block.textContent = block.textContent.replace(/\\br/g, '\n');

  // Add indentation after "%>%" and "+"
  block.textContent = block.textContent.replace(/(%>%|\+)\s*\n/g, (match) => `${match.trim()}\n\t`);

  // Remove leading spaces at the beginning of the block
  block.textContent = block.textContent.replace(/^\s+/, '');

  // Replace "\t" with actual tab characters
  block.textContent = block.textContent.replace(/\\t/g, '\t');
});

let sectionSub = document.querySelectorAll(".sections-sub");
let sectionSubHeadings = document.querySelectorAll(".subheadings");
sectionSubHeadings = Array.from(sectionSubHeadings);

let timeoutIds = []; // To store timeout IDs

sectionSub.forEach((sub, index) => {
  sub.addEventListener("mouseover", () => {
      clearTimeout(timeoutIds[index]); // Clear timeout if hovering again before it hides
      sectionSubHeadings[index].style.display = "flex";
      sectionSubHeadings[index].addEventListener("mouseenter", () => {
          sectionSubHeadings[index].style.display = "flex";
      });
  });

  sub.addEventListener("mouseleave", () => {
      timeoutIds[index] = setTimeout(() => {
          sectionSubHeadings[index].style.display = "none";
      }, 500); // 1000 milliseconds delay (1 second)

      sectionSubHeadings[index].addEventListener("mouseleave", () => {
          clearTimeout(timeoutIds[index]); // Clear timeout if leaving dropdown
          sectionSubHeadings[index].style.display = "none";
      });
  });
});

gsap.registerPlugin(ScrollTrigger) 

let tl = gsap.timeline({
  // yes, we can add it to an entire timeline!
  scrollTrigger: {
    trigger: ".intro",
    start: "top top", // when the top of the trigger hits the top of the viewport
    end: "bottom top", // end after scrolling 500px beyond the start
    onLeave: () => {document.querySelector(".nav-bar").style.display = "flex";
    gsap.fromTo(".nav-bar",{opacity:0.5, yPercent:-100} ,{duration: 1, opacity: 1,yPercent:0 ,ease: "power2.inOut"});},
      onEnterBack: () => {
          gsap.fromTo(".nav-bar",{opacity:1, yPercent:0} ,{duration: 1, opacity: 0,yPercent:-100 ,ease: "power2.inOut"});
          document.querySelector(".nav-bar").style.display = "none"}
  },
});

  let listContainers = document.querySelectorAll('#list-container > div');
  let buttons = document.querySelectorAll('.toggle-section button');
  listContainers = Array.from(listContainers);
  buttons = Array.from(buttons);
  console.log(listContainers, buttons);

  buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
          button.classList.add('active');
          listContainers[index].classList.remove('hidden');
          buttons.forEach((otherButton, otherIndex) => {
              if (otherIndex !== index) {
                  otherButton.classList.remove('active');
                  listContainers[otherIndex].classList.add('hidden');
              }
          });
      })
      // Turn off all other buttons

  });
  