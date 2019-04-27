let DATA;
let METADATA;

let set1 = {
  browserSelect: null,
  browserVersionSelect: null,
  osSelect: null,
  osVersionSelect: null,
  apiSelect: null,
  gehContainer: null,
};

let set2 = {
  browserSelect: null,
  browserVersionSelect: null,
  osSelect: null,
  osVersionSelect: null,
  apiSelect: null,
  gehContainer: null,
};

function getGEHs (browser, browserVersion, os, osVersion, api) {
  return DATA[browser][browserVersion][os][osVersion][api];
}

function getGEHsBySelectedOptions (setnum) {
  const set = getSet (setnum);
  return getGEHs (
    set.browserSelect.options[set.browserSelect.selectedIndex].value,
    set.browserVersionSelect.options[set.browserVersionSelect.selectedIndex]
      .value,
    set.osSelect.options[set.osSelect.selectedIndex].value,
    set.osVersionSelect.options[set.osVersionSelect.selectedIndex].value,
    set.apiSelect.options[set.apiSelect.selectedIndex].value
  );
}

function getSet (setnum) {
  if (typeof setnum === 'object') {
    setnum = setnum.target.id;
  }

  let set;

  if (setnum.indexOf ('1') > -1) {
    set = set1;
  }
  if (setnum.indexOf ('2') > -1) {
    set = set2;
  }

  if (!set) {
    throw 'failed to get set';
  }

  return set;
}

function getData (cb) {
  fetch ('./data.json')
    .then (function (response) {
      return response.json ();
    })
    .then (function (myJson) {
      DATA = myJson;
      if (DATA && METADATA) {
        cb (DATA, METADATA, '1');
        cb (DATA, METADATA, '2');
      }
    });

  fetch ('./metadata.json')
    .then (function (response) {
      return response.json ();
    })
    .then (function (myJson) {
      METADATA = myJson;
      if (DATA && METADATA) {
        cb (DATA, METADATA, '1');
        cb (DATA, METADATA, '2');
      }
    });
}

function onSelect (event, dontMarkDiffs = false) {
  const setnum = event.target.id.replace(/\D/g,'');
  const set = getSet (setnum);

  while (set.gehContainer.firstChild) {
    set.gehContainer.removeChild (set.gehContainer.firstChild);
  }

  const arr = getGEHsBySelectedOptions (setnum)//.sort();

  for (let i = 0; i < arr.length; i++) {
    const geh = arr[i];
    const gehA = document.createElement ('a');

    gehA.textContent = geh;
    gehA.id = geh + '-' + setnum;
    gehA.style.margin = '10px';
    gehA.style.color = 'black';
    gehA.style.textDecoration = 'none';
    gehA.href = `https://www.google.com/search?q=${set.apiSelect.options[set.apiSelect.selectedIndex].value}%20${geh}%20mdn`;
    gehA.target = '_blank';

    const div = document.createElement ('div');
    div.appendChild (gehA);

    set.gehContainer.appendChild (div);
  }

  !dontMarkDiffs && markDiffs();
}

function load (data, metadata, setnum) {
  const set = getSet (setnum);

  for (const browser in data) {
    const browserImg = metadata[browser]['img'];
    const browserData = data[browser];

    const browserOption = document.createElement ('option');

    browserOption.text = browser;
    browserOption.id = browser;
    browserOption.classList += 'browser';

    set.browserSelect.appendChild (browserOption);

    for (const browserVersion in browserData) {
      const browserVersionData = browserData[browserVersion];

      const browserVersionOption = document.createElement ('option');

      browserVersionOption.text = browserVersion;
      browserVersionOption.id = browserVersion;
      browserVersionOption.classList += 'version';

      set.browserVersionSelect.appendChild (browserVersionOption);

      for (const os in browserVersionData) {
        const osData = browserVersionData[os];

        const osOption = document.createElement ('option');

        osOption.text = os;
        osOption.id = os;
        osOption.classList += 'version';

        set.osSelect.appendChild (osOption);

        for (const osVersion in osData) {
          const apis = osData[osVersion];

          const osVersionOption = document.createElement ('option');

          osVersionOption.text = osVersion;
          osVersionOption.id = osVersion;
          osVersionOption.classList += 'version';

          set.osVersionSelect.appendChild (osVersionOption);

          for (const api in apis) {
            const apiOption = document.createElement ('option');

            apiOption.text = api;
            apiOption.id = api;
            apiOption.classList += 'api';
            apiOption.style.color = 'red';

            if ('window' === api) {
              apiOption.selected = 'selected';
            }

            set.apiSelect.appendChild (apiOption);
          }
        }
      }
    }
  }

  initDropDowns (setnum);
  onSelect ({target: {id: setnum}}, true);
}

function init (setnum) {
  const set = getSet (setnum);
  set.browserSelect = document.querySelector ('#browser-select-' + setnum);
  set.browserVersionSelect = document.querySelector (
    '#browser-version-select-' + setnum
  );
  set.osSelect = document.querySelector ('#os-select-' + setnum);
  set.osVersionSelect = document.querySelector ('#os-version-select-' + setnum);
  set.apiSelect = document.querySelector ('#api-' + setnum);
  set.gehContainer = document.querySelector ('#geh-container-' + setnum);

  set.gehContainer.style.width = '100%';

  set.browserSelect.onchange = set.browserVersionSelect.onchange = set.osSelect.onchange = set.osVersionSelect.onchange = set.apiSelect.onchange = onSelect;
}

function initDropDowns (setnum) {
  $ ('#browser-select-' + setnum).dropdown ();
  $ ('#browser-version-select-' + setnum).dropdown ();
  $ ('#os-select-' + setnum).dropdown ();
  $ ('#os-version-select-' + setnum).dropdown ();
  $ ('#api-' + setnum).dropdown ();

  $ ('#api-' + setnum)[0].parentElement.style.width = '83%';
}

function main () {
  init ('1');
  init ('2');
  getData (load);
}

setTimeout (main, 100);
