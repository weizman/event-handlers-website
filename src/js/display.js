CONFIG = {
  'normal-mode': 'Normal Mode',
  'diff-mode': 'Diff Mode',
  'display-diff-only': 'Display Differences Only',
  'display-everything': 'Display Everything',
};

let modeButton, displayButton;

function getGEHElement (geh, setnum) {
  return document.querySelector (`#${geh}-${setnum}`);
}

function unmarkDiff (geh, setnum, removeSimilars = false) {
  const e = getGEHElement (geh, setnum);
  if (removeSimilars) {
    e.style.display = 'none';
  } else {
    e.style.display = 'block';
    e.style.color = 'black';
  }
}

function markDiff (geh, setnum) {
  getGEHElement (geh, setnum).style.color = 'green';
}

function markDiffs (removeSimilars = false) {
  const gehs1 = getGEHsBySelectedOptions ('1');
  const gehs2 = getGEHsBySelectedOptions ('2');

  for (let i = 0; i < gehs1.length; i++) {
    const geh = gehs1[i];
    if (getMode () === 'diff-mode' && gehs2.indexOf (geh) === -1) {
      markDiff (geh, '1');
    } else {
      unmarkDiff (geh, '1', removeSimilars);
    }
  }

  for (let i = 0; i < gehs2.length; i++) {
    const geh = gehs2[i];
    if (getMode () === 'diff-mode' && gehs1.indexOf (geh) === -1) {
      markDiff (geh, '2');
    } else {
      unmarkDiff (geh, '2', removeSimilars);
    }
  }
}

function getMode () {
  return modeButton.textContent !== CONFIG['normal-mode']
    ? 'diff-mode'
    : 'normal-mode';
}

function setMode () {
  if (!modeButton) {
    modeButton = document.querySelector ('#mode-button');
    modeButton.onclick = setMode;
  }

  const container2 = document.querySelector ('#container-2');

  if (getMode () !== 'normal-mode') {
    container2.style.display = 'none';
    modeButton.textContent = CONFIG['normal-mode'];
  } else {
    container2.style.display = 'block';
    modeButton.textContent = CONFIG['diff-mode'];
  }

  markDiffs ();
  setDisplay ();
}

function getDisplay () {
  return displayButton.textContent !== CONFIG['display-diff-only']
    ? 'display-everything'
    : 'display-diff-only';
}

function setDisplay () {
  if (!displayButton) {
    displayButton = document.querySelector ('#display-button');
    displayButton.onclick = setDisplay;
  }

  if (getMode () === 'diff-mode') {
    displayButton.style.display = 'block';
    if ('display-everything' === getDisplay ()) {
      displayButton.textContent = CONFIG['display-diff-only'];
      markDiffs (true);
    } else {
      displayButton.textContent = CONFIG['display-everything'];
      markDiffs ();
    }
  } else {
    displayButton.style.display = 'none';
  }
}

setTimeout (setMode, 200);
setTimeout (setDisplay, 200);
