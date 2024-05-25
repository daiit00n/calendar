document.addEventListener("DOMContentLoaded", function () {
    const today = new Date();

    const dateFromInput = document.getElementById('date-from-input');
    const dateToInput = document.getElementById('date-to-input');
    const calendarFromWrapper = document.getElementById('calendar-from');
    const calendarToWrapper = document.getElementById('calendar-to');
    const errorFrom = document.getElementById('error-from');
    const errorTo = document.getElementById('error-to');

    let selectedFrom = null;
    let selectedTo = null;

    function createCalendar(wrapper, input, initialDate) {
        const calendar = document.createElement('div');
        calendar.classList.add('calendar');

        const nav = document.createElement('div');
        nav.classList.add('calendar-nav');

        const monthSelect = document.createElement('select');
        const yearSelect = document.createElement('select');

        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });

        const currentYear = today.getFullYear();
        for (let i = currentYear - 100; i <= currentYear + 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }

        monthSelect.value = initialDate.getMonth();
        yearSelect.value = initialDate.getFullYear();

        nav.appendChild(monthSelect);
        nav.appendChild(yearSelect);
        calendar.appendChild(nav);

        const daysHeader = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        daysHeader.forEach(day => {
            const dayElem = document.createElement('div');
            dayElem.classList.add('header');
            dayElem.textContent = day;
            calendar.appendChild(dayElem);
        });

        monthSelect.addEventListener('change', () => updateCalendar(calendar, parseInt(monthSelect.value), parseInt(yearSelect.value)));
        yearSelect.addEventListener('change', () => updateCalendar(calendar, parseInt(monthSelect.value), parseInt(yearSelect.value)));

        wrapper.appendChild(calendar);
        updateCalendar(calendar, initialDate.getMonth(), initialDate.getFullYear());

        input.addEventListener('click', () => {
            wrapper.style.display = wrapper.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target) && !input.contains(e.target)) {
                wrapper.style.display = 'none';
            }
        });
    }

    function updateCalendar(calendar, month, year) {
        const daysContainer = calendar.querySelectorAll('.calendar div:not(.header):not(.calendar-nav)');
        daysContainer.forEach(day => day.remove());

        const d = new Date(year, month);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < getDay(d); i++) {
            const empty = document.createElement('div');
            calendar.appendChild(empty);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('day');
            dayElem.textContent = i;
            dayElem.dataset.date = `${i.toString().padStart(2, '0')}.${(month + 1).toString().padStart(2, '0')}.${year}`;

            dayElem.addEventListener('click', function () {
                let date = parseDate(dayElem.dataset.date);
                if (calendar.parentElement.id === 'calendar-from') {
                    selectedFrom = date;
                    dateFromInput.value = formatDate(date);
                } else {
                    selectedTo = date;
                    dateToInput.value = formatDate(date);
                }

                validateDates();
                highlightDates();
            });

            calendar.appendChild(dayElem);
        }

        highlightDates();
    }

    function getDay(date) {
        let day = date.getDay();
        if (day == 0) day = 7;
        return day - 1;
    }

    function formatDate(date) {
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        let yyyy = date.getFullYear();

        return dd + '.' + mm + '.' + yyyy;
    }

    function parseDate(str) {
        let [dd, mm, yyyy] = str.split('.');
        return new Date(yyyy, mm - 1, dd);
    }

    function validateDates() {
        let valid = true;

        if (selectedFrom && selectedTo) {
            if (selectedFrom > selectedTo) {
                errorFrom.textContent = 'Дата начала периода превышает дату окончания';
                errorFrom.style.visibility = 'visible';
                dateFromInput.classList.add('error');
                valid = false;
            } else {
                errorFrom.style.visibility = 'hidden';
                dateFromInput.classList.remove('error');
            }
        }

        if (selectedTo) {
            if (selectedTo > today) {
                errorTo.textContent = 'Выберите дату не позднее сегодняшнего дня';
                errorTo.style.visibility = 'visible';
                dateToInput.classList.add('error');
                valid = false;
            } else {
                errorTo.style.visibility = 'hidden';
                dateToInput.classList.remove('error');
            }
        }

        return valid;
    }

    function highlightDates() {
        document.querySelectorAll('.calendar .day').forEach(dayElem => {
            let date = parseDate(dayElem.dataset.date);
            dayElem.classList.remove('selected', 'in-range');

            if (selectedFrom && selectedTo) {
                if (date >= selectedFrom && date <= selectedTo) {
                    dayElem.classList.add('in-range');
                }
                if (date.getTime() === selectedFrom.getTime() || date.getTime() === selectedTo.getTime()) {
                    dayElem.classList.add('selected');
                }
            } else if (selectedFrom) {
                if (date.getTime() === selectedFrom.getTime()) {
                    dayElem.classList.add('selected');
                }
            }
        });
    }

    createCalendar(calendarFromWrapper, dateFromInput, today);
    createCalendar(calendarToWrapper, dateToInput, today);
});
