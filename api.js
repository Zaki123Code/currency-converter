const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

   
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const convertBtn = document.querySelector('#convert-btn');
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount");
  let errorMsg = document.querySelector(".errormsg");
  let amtVal = amount.value;

  
  if (amtVal <= 0) {
    errorMsg.innerText = "Please enter a value greater than 0.";
    errorMsg.style.visibility = "visible"; 
    errorMsg.style.color="red";
    return; 
  }

  errorMsg.style.visibility = "hidden"; 

  const URL = `${BASE_URL}/${fromCurr.value}`;   

  try {
    let response = await fetch(URL);
    console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    let data = await response.json();
    console.log(data);
    let rate = data.rates[toCurr.value]; 

    if (!rate) {
      throw new Error("Invalid target currency or rate not found");
    }

    let finalAmount = (amtVal * rate).toFixed(2); 
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error(error.message);
    msg.innerText = "Something went wrong. Please try again later.";
  }
};


const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  if (countryCode) {
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
  }
};


btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
