// Save state

document.addEventListener('DOMContentLoaded', () => {
    const settings = document.querySelectorAll('[data-setting]');

    // Load normal settings
    settings.forEach(input => {
        const key = input.dataset.setting;
        const saved = localStorage.getItem(key);
        if (saved !== null) input.value = saved;
    });

    // Sync and store on input
    settings.forEach(input => {
        input.addEventListener('input', () => {
            const key = input.dataset.setting;
            const newValue = input.value;
            localStorage.setItem(key, newValue);

            settings.forEach(other => {
                if (other !== input && other.dataset.setting === key) {
                    other.value = newValue;
                }
            });
        });
    });

    // Load saved marks
    let savedRows;
    try {
        savedRows = JSON.parse(localStorage.getItem('markRows')) || [];
    } catch {
        savedRows = [];
    }

    if (savedRows.length === 0) {
        addRow(true); // add empty initial row
    } else {
        savedRows.forEach((row, index) => {
            addRow(index === 0, row.nota, row.porcentaje); // first = initial
        });
    }
});

// Show popup

function showPopup(message) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.classList.add('show');
    popup.classList.remove('hidden');
    
    clearTimeout(popup._timeout); // Avoid overlap bugs
    popup._timeout = setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('hidden');
    }, 3000); // Show for 3 seconds
}

// Tooltip window

const tooltipButton = document.getElementById('tooltip-button');
const tooltipWindow = document.getElementById('tooltip-window');
const tooltipClose = document.getElementById('close-tooltip');
const overlay = document.querySelector('.overlay');

// Show tooltip
tooltipButton.addEventListener('click', (e) => {
    e.preventDefault();
    tooltipWindow.classList.add('active');
    overlay.classList.add('active');
});

// Close tooltip with button
tooltipClose.addEventListener('click', (e) => {
    e.preventDefault();
    tooltipWindow.classList.remove('active');
    overlay.classList.remove('active');
});

// Close tooltip when clicking overlay
overlay.addEventListener('click', () => {
    if (tooltipWindow.classList.contains('active')) {
        tooltipWindow.classList.remove('active');
        overlay.classList.remove('active');
    }
});

//  Open settings

const settingsToggle = document.getElementById('settings-toggle');
const settingsClose = document.getElementById('settings-close');
const settingsWrap = document.querySelector('.container-wrap.settings-wrap');

settingsToggle.addEventListener('click', (e) => {
  e.preventDefault();

  // First make it visible
  settingsWrap.classList.add('active');
  overlay.classList.add('active');

  // Then trigger the animation
  requestAnimationFrame(() => {
    settingsWrap.classList.add('show');
    settingsWrap.classList.remove('hide');
  });
});

settingsClose.addEventListener('click', (e) => {
  e.preventDefault();

  overlay.classList.remove('active');
  settingsWrap.classList.remove('show');
  settingsWrap.classList.add('hide');

  // Wait for the animation to finish, then hide it from layout
  setTimeout(() => {
    settingsWrap.classList.remove('active');
  }, 300); // match the CSS transition time
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  settingsWrap.classList.remove('show');
  settingsWrap.classList.add('hide');

  setTimeout(() => {
    settingsWrap.classList.remove('active');
  }, 300);
});


// Close settings when clicking the close button.

settingsClose.addEventListener('click', (event) => {
  event.preventDefault(); // Prevents link from navigating
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

// Close settings or tooltip when clicking outside

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

// Toggle exam

const examToggle = document.getElementById('exam_toggle');
const examenWrap = document.getElementById('examen-wrap');
examToggle.addEventListener('click', () => {
  examenWrap.classList.toggle('active');
  examToggle.classList.toggle('active');
});

// Animate settings window

settingsToggle.addEventListener('click', (event) => {
  event.preventDefault();
  overlay.classList.add('active');
  settingsWrap.classList.add('active');
});

settingsClose.addEventListener('click', (event) => {
  event.preventDefault();
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

// MARK: Adding mark rows dynamically.

let filaCount = 0;

function addRow(initial = false, nota = '', porcentaje = '') {
    const container = document.getElementById("notasGrid");

    const fila = document.createElement("div");
    fila.classList.add("fila");

    // Mark input
    const notaInput = document.createElement("input");
    notaInput.type = "text";
    notaInput.classList.add("mark-input");
    notaInput.placeholder = "68 / 6.8 / 6,8";
    notaInput.maxLength = 4;
    notaInput.value = nota;
    notaInput.oninput = function () {
        this.value = this.value.replace(/[^0-9.,]/g, '').slice(0, this.maxLength);
        saveMarksToLocalStorage();
    };

    // Percentage input
    const porcentajeInput = document.createElement("input");
    porcentajeInput.type = "text";
    porcentajeInput.classList.add("number-input");
    porcentajeInput.maxLength = 2;
    porcentajeInput.value = porcentaje;
    porcentajeInput.oninput = function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, this.maxLength);
        saveMarksToLocalStorage();
    };

    fila.appendChild(notaInput);
    fila.appendChild(porcentajeInput);

    // Delete button
    const deleteBtn = document.createElement("a");
    deleteBtn.href = "#";
    deleteBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
    if (!initial) {
        deleteBtn.onclick = function (e) {
            e.preventDefault();
            container.removeChild(fila);
            saveMarksToLocalStorage();
        };
    } else {
        deleteBtn.style.opacity = "0";
        deleteBtn.style.pointerEvents = "none";
        deleteBtn.style.cursor = "none";
    }

    fila.appendChild(deleteBtn);
    container.appendChild(fila);
}

// Save state of rows and marks

function saveMarksToLocalStorage() {
    const rows = document.querySelectorAll('#notasGrid .fila');
    const data = [];

    rows.forEach(row => {
        const nota = row.querySelector('.mark-input')?.value || '';
        const porcentaje = row.querySelector('.number-input')?.value || '';

        // Only save if at least one is filled (optional)
        if (nota || porcentaje) {
            data.push({ nota, porcentaje });
        }
    });

    localStorage.setItem('markRows', JSON.stringify(data));
}

// Digit input validation.

// Allow digits, comma and dot
document.querySelectorAll('.mark-input').forEach(input => {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9.,]/g, '');
    });
});

// Allow only whole numbers
document.querySelectorAll('.number-input').forEach(input => {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
    });
});

// Sync nota aprobación on top with the same input in settings

const aprobacionInputs = document.querySelectorAll('.aprobacion-input');

aprobacionInputs.forEach(input => {
    input.addEventListener('input', () => {
        const newValue = input.value;
        aprobacionInputs.forEach(otherInput => {
            if (otherInput !== input) {
                otherInput.value = newValue;
            }
        });
    });
});

// === THE MOST FUN PART (calculating)===

// Access all variables in settings.

function getSettings() {
    return {
        aprobacion: parseFloat(localStorage.getItem('aprobacion') || 4),
        notaMin: parseFloat(localStorage.getItem('nota-min') || 1),
        notaMax: parseFloat(localStorage.getItem('nota-max') || 7),
        decimals: parseInt(localStorage.getItem('decimals') || 1),
    };
}

// Calculate the required mark for the exam

function getMarks() {
    const rows = document.querySelectorAll('.fila');
    const isExamActive = document.getElementById('exam_toggle').classList.contains('active');

    let totalWeight = 0;
    let weightedSum = 0;

    rows.forEach(row => {
        const isExamRow = row.closest('#examen-wrap'); // this will be truthy only for the exam row

        // If this is the exam row but the toggle is not active, skip it
        if (isExamRow && !isExamActive) return;

        const mark = parseFloat(row.querySelector('.mark-input')?.value.replace(',', '.') || 0);
        const percentage = parseFloat(row.querySelector('.number-input')?.value || 0);

        if (!isNaN(mark) && !isNaN(percentage)) {
            weightedSum += mark * (percentage / 100);
            totalWeight += percentage;
        }
    });

    return { totalWeight, weightedSum };
}


function updateOutput() {
    const percentageRem = document.getElementById('percentage-remainder');
    const avgElem = document.getElementById('current_average');
    const output = document.getElementById('output');
    const { aprobacion, notaMax, notaMin, decimals } = getSettings();
    const { totalWeight, weightedSum } = getMarks();

    if (totalWeight > 100) {
        showPopup("El porcentaje total supera el 100%");
        output.style.color = "var(--color-error)";
        output.textContent = "Sobre 100%"
        document.getElementById('required-label').style.display = "none";
        percentageRem.textContent = "--%";
        avgElem.textContent = "--";
        return;
    } else {
        document.getElementById('required-label').style.display = "";
    }

    const remainingWeight = 100 - totalWeight;
    const required = (aprobacion - weightedSum) / (remainingWeight / 100);
    const average = totalWeight > 0 ? (weightedSum / (totalWeight / 100)) : 0;

    // Trigger popups for invalid required grades
    if (required > notaMax) {
        showPopup(`La nota requerida (${required.toFixed(decimals)}) supera la nota máxima (${notaMax}) ☠️`);
        output.style.color = "var(--color-error)";
    } else {
        output.style.color = "var(--color-success)";
    }

    if (required < notaMin) {
        output.textContent = notaMin;
    }

    const roundedRequired = Math.max(notaMin, Math.min(required, 9999)).toFixed(decimals);
    const roundedAvg = average.toFixed(decimals);

    output.textContent = roundedRequired;
    percentageRem.textContent = `${remainingWeight}%`;
    avgElem.textContent = roundedAvg;

    avgElem.style.color = average < aprobacion ? "var(--color-error)" : "var(--color-success)";
}

document.getElementById("calculate").addEventListener("click", updateOutput);

// Live update on percentage remainder

document.querySelectorAll(".mark-input, .number-input").forEach(input => {
    input.addEventListener("input", updateOutput);
});