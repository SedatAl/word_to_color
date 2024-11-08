document.getElementById('colorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
});

document.getElementById('sentence').addEventListener('input', async (e) => {
    const sentence = e.target.value.trim();
    if (!sentence) {
        clearResults();
        return;
    }

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `sentence=${encodeURIComponent(sentence)}`
        });

        const data = await response.json();
        

        const resultContainer = document.getElementById('result');
        resultContainer.classList.remove('hidden');

        // Update gradient
        const gradientBanner = document.querySelector('.gradient-banner');
        const gradientColors = data.colors.map((color, index) => {
            // For single word, create a solid color
            if (data.colors.length === 1) {
                const rgbStr = `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`;
                return `${rgbStr} 0%, ${rgbStr} 100%`;
            }
            // create gradient stop
            const percentage = (index / (data.colors.length - 1)) * 100;
            return `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]}) ${percentage}%`;
        });
        gradientBanner.style.background = `linear-gradient(to right, ${gradientColors.join(', ')})`;

        // Update color grid
        const colorGrid = document.querySelector('.color-grid');
        colorGrid.innerHTML = data.colors.map(color => {
            const rgbStr = `(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`;
            return `
                <div class="color-box" style="background-color: rgb${rgbStr}; color: ${color.text_color}">
                    <div class="word-wrapper">
                        <div class="word">${color.word}</div>
                    </div>
                    <div class="color-info">
                        <div>RGB: ${rgbStr}</div>
                        <div>HEX: ${color.hex}</div>
                    </div>
                </div>
            `;
        }).join('');


        adjustFontSizes();

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

function clearResults() {
    const resultContainer = document.getElementById('result');
    resultContainer.classList.add('hidden');
    const colorGrid = document.querySelector('.color-grid');
    colorGrid.innerHTML = '';
    const gradientBanner = document.querySelector('.gradient-banner');
    gradientBanner.style.background = 'none';
}

function adjustFontSizes() {
    const wordWrappers = document.querySelectorAll('.word-wrapper');
    const colorBoxes = document.querySelectorAll('.color-box');
    
    // Get the smallest box width
    const boxWidths = Array.from(colorBoxes).map(box => box.offsetWidth);
    const minBoxWidth = Math.min(...boxWidths);
    
    wordWrappers.forEach(wrapper => {
        const word = wrapper.querySelector('.word');
        let fontSize = 24; // Starting font size
        word.style.fontSize = `${fontSize}px`;
        
        // Reduce font size until word fits
        while (word.offsetWidth > minBoxWidth * 0.8 && fontSize > 8) {
            fontSize -= 1;
            word.style.fontSize = `${fontSize}px`;
        }
    });
}


window.addEventListener('resize', adjustFontSizes);
