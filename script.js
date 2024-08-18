
let selectedMusicFile = null;
let selectedAmbientFile = null;
let musicAudio = null;
let ambientAudio = null;

document.getElementById('music-folder').addEventListener('change', (event) => {
    document.getElementById('music-file-name').textContent = "Folder Selected";
});

document.getElementById('ambient-folder').addEventListener('change', (event) => {
    document.getElementById('ambient-file-name').textContent = "Folder Selected";
});

document.getElementById('select-button').addEventListener('click', () => {
    const situation = document.getElementById('situation').value.trim().toLowerCase();
    const musicFiles = document.getElementById('music-folder').files;
    const ambientFiles = document.getElementById('ambient-folder').files;

    if (musicFiles.length > 0 && ambientFiles.length > 0) {
        selectedMusicFile = findBestMatchingFile(musicFiles, situation);
        selectedAmbientFile = findBestMatchingFile(ambientFiles, situation);

        if (selectedMusicFile && selectedAmbientFile) {
            document.getElementById('play-button').disabled = false;
            document.getElementById('music-file-name').textContent = `Selected Music File: ${selectedMusicFile.name}`;
            document.getElementById('ambient-file-name').textContent = `Selected Ambient File: ${selectedAmbientFile.name}`;
            alert('Files selected successfully.');
        } else {
            alert('No matching files found.');
        }
    } else {
        alert('Please select both music and ambient sound folders.');
    }
});

document.getElementById('play-button').addEventListener('click', () => {
    if (selectedMusicFile && selectedAmbientFile) {
        musicAudio = new Audio(URL.createObjectURL(selectedMusicFile));
        ambientAudio = new Audio(URL.createObjectURL(selectedAmbientFile));

        musicAudio.volume = document.getElementById('music-volume').value;
        ambientAudio.volume = document.getElementById('ambient-volume').value;

        musicAudio.play();
        ambientAudio.play();

        document.getElementById('play-button').disabled = true;
        document.getElementById('stop-button').disabled = false;
    }
});

document.getElementById('stop-button').addEventListener('click', () => {
    if (musicAudio && ambientAudio) {
        musicAudio.pause();
        ambientAudio.pause();

        musicAudio.currentTime = 0;
        ambientAudio.currentTime = 0;

        document.getElementById('play-button').disabled = false;
        document.getElementById('stop-button').disabled = true;
    }
});

document.getElementById('clear-button').addEventListener('click', () => {
    selectedMusicFile = null;
    selectedAmbientFile = null;
    musicAudio = null;
    ambientAudio = null;

    document.getElementById('situation').value = '';
    document.getElementById('music-file-name').textContent = 'No file selected';
    document.getElementById('ambient-file-name').textContent = 'No file selected';

    document.getElementById('play-button').disabled = true;
    document.getElementById('stop-button').disabled = true;
});

document.getElementById('music-volume').addEventListener('input', (event) => {
    if (musicAudio) {
        musicAudio.volume = event.target.value;
    }
});

document.getElementById('ambient-volume').addEventListener('input', (event) => {
    if (ambientAudio) {
        ambientAudio.volume = event.target.value;
    }
});

function findBestMatchingFile(files, situation) {
    let bestMatch = null;
    let bestMatchScore = 0;

    for (let file of files) {
        let fileName = file.name.toLowerCase().replace(/\.[^/.]+$/, ""); // remove extension
        if (fileName === situation) {
            return file; // exact match
        }

        let matchScore = calculateMatchScore(fileName, situation);
        if (matchScore > bestMatchScore) {
            bestMatch = file;
            bestMatchScore = matchScore;
        }
    }
    return bestMatch; // return the best match found, even if not exact
}

function calculateMatchScore(fileName, situation) {
    let fileWords = fileName.split(/[\s-_]+/);
    let situationWords = situation.split(/[\s-_]+/);

    let score = 0;
    for (let word of situationWords) {
        if (fileWords.includes(word)) {
            score++;
        }
    }
    return score;
}
