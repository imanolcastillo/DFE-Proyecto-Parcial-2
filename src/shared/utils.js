function formatDate(date) {
    if (!(date instanceof Date)) {
      throw new Error('El valor proporcionado no es una instancia de Date.');
    }
  
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
  

    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(month).padStart(2, '0');
  
    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  function formatDateToISO(date) {
    if (!(date instanceof Date)) {
        throw new Error('El valor proporcionado no es una instancia de Date.');
    }

    const formattedDate = date.toISOString().substring(0, 10);

    return formattedDate;
}

