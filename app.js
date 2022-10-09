const BASE_URL = 'https://economia.awesomeapi.com.br/last'



function $(element) {
    return document.querySelector(element);
}


const getMoneyValue = () => Number($('#value'));

const getSelectedCurrency = (a) => {
    const e = $(a);
    return e.options[e.selectedIndex].value;
};

const fetchAPI = async (from, to) => {
    const currency = await fetch(`${BASE_URL}/${from}-${to}`, {
        method: 'get',
    }).then(res =>res.json())

   return currency;
}

const conversionHandler = (insertedValue, bidCurrency) => {
    return Number(insertedValue) * Number(bidCurrency)
}

const onClick = async () => {
    const value = getMoneyValue();
    const selectedCurrencyFROM = getSelectedCurrency('#from')
    const selectedCurrencyTARGET = getSelectedCurrency('#target')


    const apiCurrency = await fetchAPI(selectedCurrencyFROM, selectedCurrencyTARGET);
}