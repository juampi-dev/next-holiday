const url = 'https://calendarific.com/api/v2/holidays';
const argentina = 'AR';

function getApiKey() {
    const key = 'T0h4RlJRbXVyTmNwTzU3SkFmd042a2d0NlNCaWZjOVk=';
    return atob(key);
}

const apiKey = getApiKey();

// Función para formatear la fecha actual
function getFormattedDate() {
    const date = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return { dayName, day, monthName, year };
}

// Función para calcular la diferencia en días entre dos fechas
function calculateDaysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
    return Math.round((date2 - date1) / oneDay);
}

// Llamamos a la función formateadora de la fecha actual y la asignamos a la constante "currentDate"
const currentDate = getFormattedDate();

// Asignamos el texto al footer con la fecha actual
document.getElementById('currentDay').innerText = `Hoy es ${currentDate.dayName}, ${currentDate.day} de ${currentDate.monthName} de ${currentDate.year}`;

// Llamamos a la API
fetch(`${url}?api_key=${apiKey}&country=${argentina}&year=${currentDate.year}`)
    .then(response => response.json())
    .then(data => {
        // Filtrar los feriados que aún no han pasado
        const today = new Date();
        const upcomingHolidays = data.response.holidays.filter(holiday => {
            const holidayDate = new Date(holiday.date.iso);
            return holidayDate >= today;
        });

        // Ordenar los feriados restantes por fecha
        upcomingHolidays.sort((a, b) => new Date(a.date.iso) - new Date(b.date.iso));

        // Seleccionar el feriado más próximo
        const nextHoliday = upcomingHolidays[0];
        const nextHolidayDate = new Date(nextHoliday.date.iso);

        // Calcular los días restantes hasta el próximo feriado
        const daysUntilNextHoliday = calculateDaysDifference(today, nextHolidayDate);
        console.log(`Faltan ${daysUntilNextHoliday} días para el próximo feriado: ${nextHoliday.name}`);
        
        // Actualizar el DOM con los datos del próximo feriado
        document.getElementById('numero').innerText = daysUntilNextHoliday;
        document.getElementById('proximaFecha').innerText = nextHolidayDate.toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        document.getElementById('nombreFeriado').innerText = nextHoliday.name;
    })
    .catch(error => console.error('Error al obtener los feriados:', error));
