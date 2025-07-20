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

// Digit input validation and max grade enforcement

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
    notaInput.placeholder = "70 / 7,0 / 7.0";
    notaInput.maxLength = 4;
    notaInput.value = nota;
    notaInput.oninput = function () {
        enforceMaxGrade(this);
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

function normalizeMark(value) {
    value = value.replace(',', '.');
    const percentScaleToggle = document.getElementById('percent-scale-toggle');
    // Only normalize if checkbox is NOT checked
    if (percentScaleToggle && !percentScaleToggle.checked && !value.includes('.')) {
        if (/^\d{2,}$/.test(value)) {
            value = value[0] + '.' + value.slice(1);
        }
    }
    return value;
}

function getMarks() {
    const rows = document.querySelectorAll('.fila');
    const isExamActive = document.getElementById('exam_toggle').classList.contains('active');

    let totalWeight = 0;
    let weightedSum = 0;

    rows.forEach(row => {
        const isExamRow = row.closest('#examen-wrap'); // this will be truthy only for the exam row

        // If this is the exam row but the toggle is not active, skip it
        if (isExamRow && !isExamActive) return;

        const rawMark = row.querySelector('.mark-input')?.value || '';
        const mark = parseFloat(normalizeMark(rawMark)) || 0;
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
    const requiredLabel = document.getElementById('required-label');
    const { aprobacion, notaMax, notaMin, decimals } = getSettings();
    const { totalWeight, weightedSum } = getMarks();
    const outputText = document.getElementById('output-text');

    const examToggle = document.getElementById('exam_toggle');
    const isExamActive = examToggle.classList.contains('active');
    const examRow = document.querySelector('#examen-wrap .fila');
    const examMarkInput = examRow ? examRow.querySelector('[data-setting="exam-mark"]') : null;
    const examPercInput = examRow ? examRow.querySelector('[data-setting="exam-percentage"]') : null;
    const examMark = examMarkInput ? normalizeMark(examMarkInput.value) : '';
    const examPerc = examPercInput ? examPercInput.value : '';

    // Exam mode logic
    if (isExamActive) {
        // Only grades (not exam) must sum to 100%
        const gradesPercent = totalWeight;

        if (gradesPercent !== 100) {
            output.style.color = "var(--color-error)";
            output.style.marginBottom = "30px";
            output.textContent = "Notas deben sumar 100%";
            showPopup("La suma de los porcentajes de las notas debe ser exactamente 100%");
            requiredLabel.style.display = "none";
            outputText.style.display = "none";
            return;
        }

        // Case 1: Grade empty, percentage filled
        if (!examMark && examPerc) {
            requiredLabel.style.display = "";
            percentageRem.textContent = `${examPerc}%`;
            avgElem.textContent = "--";
            // Calculate required mark for exam
            const remainingWeight = parseFloat(examPerc);
            const required = (aprobacion - weightedSum) / (remainingWeight / 100);
            const roundedRequired = Math.max(notaMin, Math.min(required, 9999)).toFixed(decimals);
            output.textContent = roundedRequired;
            output.style.color = required > notaMax ? "var(--color-error)" : "var(--color-success)";
            return;
        }

        // Case 2: Grade filled, percentage empty
        if (examMark && !examPerc) {
            showPopup("porcentaje de examen no puede estar vacío");
            output.style.color = "var(--color-error)";
            output.textContent = "--";
            requiredLabel.style.display = "none";
            percentageRem.textContent = "--%";
            avgElem.textContent = "--";
            return;
        }

        // Case 3: Both grade and percentage filled
        if (examMark && examPerc) {
            requiredLabel.textContent = "Tu promedio final es:";
            requiredLabel.style.display = "";
            outputText.style.display = "none";
            // Calculate final average
            const examMarkNum = parseFloat(examMark) || 0;
            const examPercNum = parseFloat(examPerc) || 0;
            const finalWeightedSum = weightedSum + examMarkNum * (examPercNum / 100);
            const finalAverage = finalWeightedSum / ((gradesPercent + examPercNum) / 100);
            const roundedAvg = finalAverage.toFixed(decimals);
            output.textContent = roundedAvg;
            avgElem.textContent = roundedAvg;
            output.style.color = finalAverage < aprobacion ? "var(--color-error)" : "var(--color-success)";
            avgElem.style.color = output.style.color;
            return;
        }

        // Default: nothing filled
        output.textContent = "--";
        requiredLabel.style.display = "none";
        percentageRem.textContent = "--%";
        avgElem.textContent = "--";
        return;
    }

    // Default behavior (exam not active)
    requiredLabel.style.display = "";
    if (totalWeight > 100) {
        showPopup("El porcentaje total supera el 100%");
        output.style.color = "var(--color-error)";
        output.textContent = "Sobre 100%";
        requiredLabel.style.display = "none";
        percentageRem.textContent = "--%";
        avgElem.textContent = "--";
        return;
    }

    const remainingWeight = 100 - totalWeight;
    const required = (aprobacion - weightedSum) / (remainingWeight / 100);
    const average = totalWeight > 0 ? (weightedSum / (totalWeight / 100)) : 0;

    if (isFinite(required) && required > notaMax) {
        showPopup(`La nota requerida (${required.toFixed(decimals)}) supera la nota máxima (${notaMax}) ☠️`);
        output.style.color = "var(--color-error)";
    } else {
        output.style.color = "var(--color-success";
    }

    if (required < notaMin) {
        output.textContent = notaMin;
    }

    const roundedRequired = Math.max(notaMin, Math.min(required, 9999)).toFixed(decimals);
    const roundedAvg = average.toFixed(decimals);

    if (!isExamActive && totalWeight === 100) {
        requiredLabel.textContent = "Tu promedio final es:";
        requiredLabel.style.display = "";
        outputText.style.display = "none";
        percentageRem.textContent = "--%";
        output.textContent = roundedAvg;
        avgElem.textContent = roundedAvg;
        output.style.color = average < aprobacion ? "var(--color-error)" : "var(--color-success)";
        avgElem.style.color = output.style.color;
        return;
    } else {
        requiredLabel.textContent = "Necesitas un";
        requiredLabel.style.display = "";
        outputText.style.display = "";
    }

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

// Force decimals to 0 when checkbox is checked

const percentScaleToggle = document.getElementById('percent-scale-toggle');
const decimalsSelect = document.getElementById('decimales');

percentScaleToggle.addEventListener('change', () => {
    if (percentScaleToggle.checked) {
        decimalsSelect.value = "0";
        localStorage.setItem('decimals', "0");
        localStorage.setItem('nota-max', "100");
        localStorage.setItem('aprobacion', "55");
        localStorage.setItem('nota-min', "0");
        document.getElementById('decimales').value = "0";
        document.querySelectorAll('.aprobacion-input').forEach(i => i.value = "55");
        // If you have inputs for min/max, update them too:
        document.querySelectorAll('[data-setting="nota-max"]').forEach(i => i.value = "100");
        document.querySelectorAll('[data-setting="nota-min"]').forEach(i => i.value = "0");
    } else {
        decimalsSelect.value = "1";
        localStorage.setItem('decimals', "1");
        localStorage.setItem('nota-max', "7");
        localStorage.setItem('aprobacion', "4");
        localStorage.setItem('nota-min', "1");
        document.getElementById('decimales').value = "1";
        document.querySelectorAll('.aprobacion-input').forEach(i => i.value = "4");
        document.querySelectorAll('[data-setting="nota-max"]').forEach(i => i.value = "7");
        document.querySelectorAll('[data-setting="nota-min"]').forEach(i => i.value = "1");
    }
    updateOutput();
});

decimalsSelect.addEventListener('change', () => {
    if (percentScaleToggle.checked) {
        decimalsSelect.value = "0";
        localStorage.setItem('decimals', "0");
    }
    updateOutput();
});