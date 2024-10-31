
  // Function to play audio
  function playAudio() {
    const audio = document.getElementById('background-audio');
    audio.play();
  }

  // Function to handle play button click
  function handlePlayButtonClick() {
    const playButton = document.getElementById('play-button');
    const content = document.getElementById('content');

    // Play the audio
    playAudio();

    // Hide the play button and show the content with a transition
    playButton.style.display = 'none';
    content.style.display = 'flex';
    content.style.opacity = 1;
  }

  // Add click event listener to the play button
  document.getElementById('play-button').addEventListener('click', handlePlayButtonClick);

  // Function to create enemy elements
  function createEnemies() {
    const content = document.getElementById('content');
    for (let i = 0; i < 3; i++) { // Generate 3 enemies
      const enemy = document.createElement('div');
      enemy.className = 'enemy-element';
      enemy.style.left = `${Math.random() * (window.innerWidth - 100)}px`; // Scatter randomly
      content.appendChild(enemy);
    }
  }

  // Function to shoot bullets from an element
  function shootBullet(element) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${element.offsetLeft + element.clientWidth / 2 - 2.5}px`;
    bullet.style.top = `${element.offsetTop}px`;
    document.getElementById('content').appendChild(bullet);

    function moveBullet() {
      bullet.style.top = `${bullet.offsetTop - 100}px`; // Increase speed significantly

      // Remove bullet if it goes off screen
      if (bullet.offsetTop < 0) {
        bullet.remove();
      } else {
        requestAnimationFrame(moveBullet);
      }
      // Check collision with enemies
      const enemies = document.getElementsByClassName('enemy-element');
      for (let enemy of enemies) {
        if (isColliding(bullet, enemy)) {
          enemy.remove();
          bullet.remove();

          // Check if all enemies are shot
          if (document.getElementsByClassName('enemy-element').length === 0) {
            createEnemies(); // Generate new enemies
          }
          break; // Exit loop once a collision is detected
        }
      }
    }

    moveBullet();
  }

  function enableTouchMove(element) {
    let isMoved = false; // To track if the element has been moved
    
    function onTouchMove(event) {
      event.preventDefault();
      const touch = event.touches[0];
      element.style.left = `${touch.clientX - element.clientWidth / 2}px`;
      element.style.top = `${touch.clientY - element.clientHeight / 2}px`;

      if (!isMoved) {
        isMoved = true;
        document.querySelector('.star-wars-text').style.display = 'none';
        element.style.width = '200px'; // Adjust the size as needed
        element.style.height = '200px'; // Adjust the size as needed
        createEnemies(); // Create enemies when the ship element is first moved

        // Start shooting bullets from the ship
        setInterval(() => shootBullet(element), 200); // Increase shooting frequency
      }
    }

    element.addEventListener('touchstart', onTouchMove);
    element.addEventListener('touchmove', onTouchMove);
  }

  // Initialize and use the function
  document.addEventListener('DOMContentLoaded', () => {
    const touchElement = document.getElementById('ship-element');
    enableTouchMove(touchElement);
  });

  // Function to detect collision between two elements
  function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }

  // Function to check for game over condition
  function checkGameOver() {
    const shipElement = document.getElementById('ship-element');
    const enemies = document.getElementsByClassName('enemy-element');
    for (let enemy of enemies) {
      if (isColliding(shipElement, enemy) || enemy.offsetTop > window.innerHeight) {
        alert('Game Over');
        window.location.reload(); // Reload the page on game over
      }
    }
  }

  // Check for game over condition at regular intervals
  setInterval(checkGameOver, 100);
