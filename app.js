const BASE_URL = "https://economia.awesomeapi.com.br/last";
const ULTIMOS_DIAS = "https://economia.awesomeapi.com.br/json/daily";

function $(element) {
   return document.querySelector(element);
}

const getMoneyValue = () => {
   return Number($("#value").value);
};

const getDayValue = () => {
   return Number($("#days").value);
};

const getSelectedCurrency = (a) => {
   const e = $(a);
   return e.options[e.selectedIndex].value;
};

const calculateDiferenceDate = (primeiraData, segundaData) => {
   let teste = new Date(primeiraData);
   
   const differenceInMonth = new Date(primeiraData) - new Date(segundaData);
   
   const differenceInDays = Math.ceil(differenceInMonth / (1000 * 60 * 60 * 24));
   

   if (differenceInDays == 0) {
      return differenceInDays + 1;
   } else if (differenceInDays < 0) {
      return differenceInDays * -1;
   } else {
      return differenceInDays;
   }
};

const fetchAPI = async (URL, from, to) => {
   const currency = await fetch(`${URL}/${from}-${to}`, {
      method: "get",
   }).then((res) => res.json());

   return currency;
};

const fetchAPIDaily = async (URL, from, to, days) => {
   const currency = await fetch(`${URL}/${from}-${to}/${days}`, {
      method: "get",
   }).then((res) => res.json());

   return currency;
};

const fetchAPIEspecificTime = async (URL, from, to, days, daysInicial, finalDays) => {
   const currency = await fetch(
      `${URL}/${from}-${to}/${days}?start_date=${daysInicial}&end_date=${finalDays}`,
      {
         method: "get",
      }
   ).then((res) => res.json());

   return currency;
};

const conversionHandler = (insertedValue, bidCurrency) => {
   
   return Number(insertedValue) * Number(bidCurrency);
};

const calculateCurrency = (value, apiCurrency) => {
   const result = conversionHandler(value, apiCurrency.bid);

   return result;
};

const insertDataInHTML = (initialValue, result, apiCurrency) => {
   let moedaOriginal = apiCurrency.name.split("/")[0];
   let moedaConvertida = apiCurrency.name.split("/")[1];

   $("#info2").innerHTML = `
        <div class="infCoin">
        <span>
         Conversão de: ${moedaOriginal} 
        </span>
        <span>
         Valor a Converter: ${initialValue} 
        </span>
        </div>
        
        <div class="infCoin">
        <span>
         Conversão para: ${moedaConvertida} 
        </span>
        <span>
         Valor da Conversão: ${result} 
        </span>
        </div>
        <div class="infCoin">
        <span>
        Variação do valor: ${apiCurrency.varBid}
        </span>
        <span>
        % de variação do valor: ${apiCurrency.pctChange}%
        </span>
        </div>
    `;
};

const insertDataInHTMLDaily = (initialValue, apiCurrency) => {
   
   let moedaOriginal = apiCurrency[0].name.split("/")[0];
   let moedaConvertida = apiCurrency[0].name.split("/")[1];
   let teste = document.createElement("div");
   teste.classList.add("divMoedas");
   $("#info2Daily").innerHTML = `<div class="infCoin">
        <span>
         Conversão de: ${moedaOriginal}
        </span>
        <span>
         Para a Converter: ${moedaConvertida} 
        </span>
        </div>`;

   for (let x = 0; x < apiCurrency.length; x++) {
      
      let dataFechamento = new Date(apiCurrency[x].timestamp * 1000).toLocaleDateString("pt-BR");
      
      let divMoeda = document.createElement("div");
      divMoeda.classList.add("infCoinMoeda");

      divMoeda.innerHTML += `
        <div class="infCoin">
        <span>
         Fechamento do dia: ${dataFechamento} 
        </span>
        <span>
         Valor da compra: ${apiCurrency[x].bid}  
        </span>
        </div>
        <div class="infCoin">
        <span>
        Variação do valor: ${apiCurrency[x].varBid}
        </span>
        <span>
        % de variação do valor: ${apiCurrency[x].pctChange}%
        </span>
        </div>
        <div class="infCoin">
        <span>
        Valor máximo: ${apiCurrency[x].high}
        </span>
        <span>
        Valor mínimo: ${apiCurrency[x].low}
        </span>
        </div>
    `;
      teste.appendChild(divMoeda);
   }
   $("#info2Daily").appendChild(teste);
};

const insertDataInHTMLEspecificTime = (apiCurrency) => {
   
   let moedaOriginal = apiCurrency[0].name.split("/")[0];
   let moedaConvertida = apiCurrency[0].name.split("/")[1];
   let divMoedas = document.createElement("div");
   divMoedas.classList.add("divMoedas");
   $("#info3Daily").innerHTML = `<div class="infCoin">
        <span>
         Conversão de: ${moedaOriginal}
        </span>
        <span>
         Para a Converter: ${moedaConvertida} 
        </span>
        </div>`;

   for (let x = 0; x < apiCurrency.length; x++) {
      
      let dataFechamento = new Date(apiCurrency[x].timestamp * 1000).toLocaleDateString("pt-BR");
      
      let divMoeda = document.createElement("div");
      divMoeda.classList.add("infCoinMoeda");

      divMoeda.innerHTML += `
        <div class="infCoin">
        <span>
         Fechamento do dia: ${dataFechamento} 
        </span>
        <span>
         Valor da compra: ${apiCurrency[x].bid}  
        </span>
        </div>
        <div class="infCoin">
        <span>
        Variação do valor: ${apiCurrency[x].varBid}
        </span>
        <span>
        % de variação do valor: ${apiCurrency[x].pctChange}%
        </span>
        </div>
        <div class="infCoin">
        <span>
        Valor máximo: ${apiCurrency[x].high}
        </span>
        <span>
        Valor mínimo: ${apiCurrency[x].low}
        </span>
        </div>
    `;
      divMoedas.appendChild(divMoeda);
   }
   $("#info3Daily").appendChild(divMoedas);
};

const onClick = async () => {
   $("#info").innerHTML = "";
   $("#info2").innerHTML = "";
   const selectedCurrencyFROM = getSelectedCurrency("#from");
   const selectedCurrencyTARGET = getSelectedCurrency("#target");

   if (selectedCurrencyFROM != selectedCurrencyTARGET) {
      const apiCurrency = await fetchAPI(BASE_URL, selectedCurrencyFROM, selectedCurrencyTARGET);
      const value = getMoneyValue();

      
      if (value != 0 && value > 0) {
         const result = calculateCurrency(
            value,
            apiCurrency[`${selectedCurrencyFROM}${selectedCurrencyTARGET}`]
         );

         insertDataInHTML(
            value,
            result.toFixed(4),
            apiCurrency[`${selectedCurrencyFROM}${selectedCurrencyTARGET}`]
         );
      }
   } else {
      $("#info").innerHTML =
         "<span>Não é possível converter valor de uma moeda para ela mesma.</span>";
   }
};

const onClickDaily = async () => {
   $("#infoDaily").innerHTML = "";
   $("#info2Daily").innerHTML = "";
   const selectedCurrencyFROM = getSelectedCurrency("#fromDaily");
   const selectedCurrencyTARGET = getSelectedCurrency("#targetDaily");

   if (selectedCurrencyFROM != selectedCurrencyTARGET) {
      const days = getDayValue();

      const apiCurrency = await fetchAPIDaily(
         ULTIMOS_DIAS,
         selectedCurrencyFROM,
         selectedCurrencyTARGET,
         days
      );

      
      
      if (days != 0 && days > 0) {
         insertDataInHTMLDaily(days, apiCurrency);
      }
   } else {
      $("#infoDaily").innerHTML =
         "<span>Não é possível verificar os últimos fechamentos de uma moeda para ela mesma.</span>";
   }
};

const onClickEspecificTime = async () => {
   $("#info3Daily").innerHTML = "";
   $("#info3Daily").innerHTML = "";
   const selectedCurrencyFROM = getSelectedCurrency("#fromDaily2");
   const selectedCurrencyTARGET = getSelectedCurrency("#targetDaily2");
   const inicialDays = $("#inicialDays").value;
   const inicialDaysTratada = inicialDays.replace(/\-/g, "");
   const finalDays = $("#finalDays").value;
   const finalDaysTratada = finalDays.replace(/\-/g, "");
   
   const differenceInDays = calculateDiferenceDate(inicialDays, finalDays);

   

   

   if (selectedCurrencyFROM != selectedCurrencyTARGET) {
      if ((inicialDays.length = 8)) {
      }
      // const days = getDayValue();

      const apiCurrency = await fetchAPIEspecificTime(
         ULTIMOS_DIAS,
         selectedCurrencyFROM,
         selectedCurrencyTARGET,
         differenceInDays,
         inicialDaysTratada,
         finalDaysTratada
      );

      
      // 
      if (differenceInDays != 0 && differenceInDays > 0) {
         insertDataInHTMLEspecificTime(apiCurrency);
      }
   } else {
      $("#infoDaily").innerHTML =
         "<span>Não é possível verificar os últimos fechamentos de uma moeda para ela mesma.</span>";
   }
};
