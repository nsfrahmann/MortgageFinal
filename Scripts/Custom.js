$(document).ready(function () {
    // Add smooth scrolling to all links
    $("a").on('click', function (event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

//Card Animations after button press
//function animate() {
//    document.getElementById("calculator").setAttribute("class", "animate-left")
//    document.getElementById("tipCard").setAttribute("class", "animate-up")
//}

//document.getElementById("detailsButton").addEventListener("click", animate)

//$("#detailsButton").click(function () {
//    $("#tipCard").fadeOut(2000, function () {
//        // Animation complete.
//    });
//});

//Calculation Section
// letiables:

// Home price, down payment, length of loan, interest rate, estimated monthly payment,
// (wishlist: homeowner's insurance, property tax, HOA, user can enter email, and be sent a summary of their calculation, calculator)

// Amortization Scehdule: Date: Payment: Principal: Interest: Balance:

// Hide table
$(".tableContainer").hide();
// Declare all letiables used in our functions

// Initial Transaction
let homePriceRange = document.getElementById("homePriceRange");
let homePrice = document.getElementById("homePrice");
let downpayment = document.getElementById("downPayment");
let dpPercentage = document.getElementById("dpPercentage");

// Loan Details
let loanAmount = document.getElementById("loanAmount");
let years = document.getElementById("term");
let interestRate = document.getElementById("interestRate");
let monthlyPayments = document.getElementById("estimatedMonthlyPayment");
let mortgageStartDate = document.getElementById("mortgageStartDate");
let monthlyAccurate;

// Set mortgage start date
let today = new Date();
let todayString;
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
let yyyy = today.getFullYear();

todayString = yyyy + "-" + mm + "-" + dd;
mortgageStartDate.value = todayString;

// Button
let detailButton = document.getElementById("detailsButton");

// INITIAL TRANSACTION //

// Handle linked values
// On range input - set home price value to the value of the slider
homePriceRange.addEventListener("input", displayBasedOnHomePriceSlider);

function displayBasedOnHomePriceSlider() {
    let commas = numberWithCommas(homePriceRange.value);
    let noCommas = numberWithoutCommas(homePriceRange.value);

    // console.log(dpNoCommas);
    // Link the value of the slider to the value of the home price input
    homePrice.value = `$ ${commas}`;
    // Link the value of the slider to the value of the downpayment
    displayDownPayment(homePriceRange.value);
    // Set the value of the downpayment AFTER you update the downpayment
    let dpNoCommas = numberWithoutCommas(downpayment.value);
    // Link the value of the slider to the value of the loan amount
    displayLoanAmount(noCommas, dpNoCommas);
    // Link the value of the estimated monthly payment to the slider
    displayMonthlyPayment(noCommas, dpNoCommas, years.value, interestRate.value);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// When the home price is manually entered, have the slider reflect this change
homePrice.addEventListener("input", function (e) {
    if (!isNumeric(e.data)) {
        homePrice.value = "";
        downpayment.value = 0;
        console.log(downpayment.value);
    }
});

// When we tab out of homeprice input, replace the numbers with a dollar amount and commas
homePrice.addEventListener("blur", () => {
    let dpp = dpPercentage.value;
    let hp = numberWithoutCommas(homePrice.value);
    let updatedDownpayment = hp * (dpp / 100);
    console.log(updatedDownpayment);
    displayLoanAmount(hp, updatedDownpayment);
    homePrice.value = `$ ${numberWithCommas(hp)}`;
    let dp = `$ ${numberWithCommas(updatedDownpayment.toFixed(0))}`;
    downpayment.value = dp;
    displayMonthlyPayment(
        hp,
        numberWithoutCommas(dp),
        years.value,
        interestRate.value
    );
    homePriceRange.value = hp;
});

// Handle downpayment and percentage

dpPercentage.addEventListener("input", () => {
    // bug: when you change downpayment percentage, value doesn't respond
    let hpNoCommas = numberWithoutCommas(homePriceRange.value);
    displayDownPayment(hpNoCommas);
    let dpNoCommas = numberWithoutCommas(downpayment.value);
    displayLoanAmount(hpNoCommas, dpNoCommas);
    displayMonthlyPayment(
        hpNoCommas,
        dpNoCommas,
        years.value,
        interestRate.value
    );
});

function displayDownPayment(homePriceValue) {
    let downpaymentNumber = dpPercentage.value * (homePriceValue / 100);
    let commas = numberWithCommas(downpaymentNumber);
    downPayment.value = `$ ${commas}`;
}

// END INITIAL TRANSACTION //

// LOAN DETAILS //

function displayLoanAmount(homeprice, downp) {
    let hp = homeprice;
    let dp = downp;
    let loan = hp - dp;
    // console.log(loan);
    loanAmount.value = `$ ${numberWithCommas(loan)}`;
}

// Recalculate monthly payment based on length of loan
years.addEventListener("change", () => {
    let hpNoCommas = numberWithoutCommas(homePriceRange.value);
    let dpNoCommas = numberWithoutCommas(downpayment.value);
    displayMonthlyPayment(
        hpNoCommas,
        dpNoCommas,
        years.value,
        interestRate.value
    );
});

interestRate.addEventListener("input", () => {
    let hpNoCommas = numberWithoutCommas(homePriceRange.value);
    let dpNoCommas = numberWithoutCommas(downpayment.value);
    displayMonthlyPayment(
        hpNoCommas,
        dpNoCommas,
        years.value,
        interestRate.value
    );
});

function displayMonthlyPayment(homePrice, dp, term, interest) {
    let downPayment = dp;
    let years = parseFloat(term);
    let interestRateNumber = parseFloat(interest);
    let price = parseFloat(homePrice);
    let totalPayments = years * 12;
    let principal = price - downPayment;
    let interestRateM = interestRateNumber / 100 / 12;

    // Compute monthly payments
    let x = Math.pow(1 + interestRateM, totalPayments); //Math.pow computes powers
    let monthly = (principal * x * interestRateM) / (x - 1);
    monthlyAccurate = monthly;

    // Round down - get rid of decimals
    monthlyPayments.value = `$ ${numberWithCommas(Math.floor(monthly))}`;
}

// Set Monthly Payment

monthlyPayments.addEventListener("input", () => {
    setMonthlyPayments(20);
});

monthlyPayments.addEventListener("blur", () => {
    let mpCommas = numberWithCommas(monthlyPayments.value);
    let hp = numberWithoutCommas(homePrice.value);
    let dp = numberWithoutCommas(downpayment.value);
    displayLoanAmount(hp, dp);
    displayDownPayment(hp);
    monthlyPayments.value = `$ ${mpCommas}`;
});

function setMonthlyPayments(downpaymentPercentage) {
    // Make sure inputs are of type number
    let interestRateNumber = parseFloat(interestRate.value);
    let localYears = parseFloat(years.value);
    // Do math
    let totalPayments = localYears * 12;
    let interestRateM = interestRateNumber / 100 / 12;
    let x = Math.pow(1 + interestRateM, 0 - totalPayments) - 1;
    let monthly = monthlyPayments.value;
    let principal = (monthly * x) / interestRateM;
    // Reset dp percentage every time the user sets a target monthly payment
    // Standard is 20%
    dpPercentage.value = parseFloat(downpaymentPercentage);
    let magic = Math.floor(Math.abs(Math.ceil(principal.toFixed(0)) * 1.25));
    // console.log(magic);
    // Round up to the nearest 1000 number
    homePrice.value = Math.round(magic / 1000) * 1000;
}

// Add Total Interest
// Add Total Repayment

// Start table

// To generate the tables I'll be taking all the data from our calculator

// DETAIL BUTTON STARTS DOING STUFF HERE.
detailButton.addEventListener("click", () => {
    // DO ALL THE MOVING OF THE CARD JUST HERE
    //$("#tipCard").addClass("d-none");
    // Grab all the data currently in our calculator
    //console.log("hey");
    let hp = numberWithoutCommas(homePrice.value);
    let dp = numberWithoutCommas(downpayment.value);
    let dpp = dpPercentage.value;

    let loan = parseFloat(numberWithoutCommas(loanAmount.value));
    // console.log(loan);
    let term = years.value;
    let termInMonths = term * 12;
    let interest = parseFloat(interestRate.value);
    displayMonthlyPayment(hp, dp, term, interest);
    // console.log(interest);
    let monthly = parseFloat(monthlyAccurate);
    // console.log(monthly);
    let startDate = mortgageStartDate.value;
    let table = document.getElementById("tableBody");
    // Reset table every click
    table.innerHTML = "";
    // Set an empty table array
    let tableArray = [];

    let yearArray = [];

    // Balance = Loan - principal paid for current month
    // monthly payment = principal paid for current month + interest per month
    // principal paid for current month = monthly payment - interest per month
    // Interest per month = balance * rate / 1200
    // principal paid to date = sum of all principal
    // interest to date = sum of all interest
    let ct = {
        balance: loan,
        monthlyPayment: monthly,
        principalPaid: 0,
        interestPaid: (loan * interest) / 1200,
        principalToDate: 0,
        interestToDate: 0,
    };
    // console.log(ct);
    // Get the values we'll need for our loop
    for (let i = 0; i <= termInMonths; i++) {
        ct.balance = ct.balance - ct.principalPaid; // OK
        ct.monthlyPayment = monthly; // OK
        ct.interestPaid = (ct.balance * interest) / 1200;
        ct.principalPaid = ct.monthlyPayment - ct.interestPaid;
        ct.principalToDate += ct.principalPaid;
        ct.interestToDate += ct.interestPaid;

        // console.log(ct, i);
        tableArray.push({
            balance: ct.balance,
            monthlyPayment: ct.monthlyPayment,
            principalPaid: ct.principalPaid,
            interestPaid: ct.interestPaid,
            principalToDate: ct.principalToDate,
            interestToDate: ct.interestToDate,
        });
        // console.log(ct);
    }
    // console.log(tableArray);
    // Set an empty array to push our dates to
    let dateArray = [];

    // Set start date
    let d1 = new Date(startDate);
    // Add one to days (damn 0 indexed values)
    d1.adjust("days", 1);
    // Set end date
    let d2 = new Date();
    d2.adjust("months", termInMonths + 1);
    // Set output letiable to push to our dateArray
    let output = "";
    let output2 = "";
    // loop by months
    d1.each(d2, "months", 1, function (currentDate, currentStep, thisDate) {
        // output = mm/dd/yyyy
        output = `${new Date(currentDate).getMonth() + 1}/${new Date(
            currentDate
        ).getDate()}/${new Date(currentDate).getFullYear()}`;
        // Until we get to the date of termInMonths, push output to array
        dateArray.push(output);
        output2 = `${new Date(currentDate).getFullYear()}`;
        yearArray.push(output2);
        // console.log(output);
    });

    // Total principal cannot be greater than original balance (loan)
    // Js had us bangin our heads against a wall tryin to figure this one out
    // Just replace the very last value with the previous value and voila.
    tableArray[tableArray.length - 1].principalToDate =
        tableArray[tableArray.length - 2].principalToDate;

    let chartDataExample = {
        type: "line",
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [
                {
                    label: "Year",
                    data: [450000, 2021, 2022, 2023, 2024, 2025],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                        "rgba(200, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },

        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                ],
            },
        },
    };

    let balanceData = [];
    let balanceBgColor = [];
    let balanceBorder = [];
    let principalData = [];
    let principalBgColor = [];
    let principalBorder = [];
    let interestData = [];
    let interestBgColor = [];
    let interestBorder = [];

    // Be sure to finish commenting this stuff...
    for (let i = 0; i < dateArray.length; i++) {
        // console.log(tableArray[i]);
        table.innerHTML += `<tr><td>${dateArray[i]}</td><td>$ ${numberWithCommas(
            tableArray[i].balance.toFixed(2)
        )}</td><td>$ ${numberWithCommas(
            tableArray[i].monthlyPayment.toFixed(2)
        )}</td><td>$ ${numberWithCommas(
            tableArray[i].principalPaid.toFixed(2)
        )}</td><td>$${numberWithCommas(
            tableArray[i].interestPaid.toFixed(2)
        )}</td><td>$ ${numberWithCommas(
            tableArray[i].principalToDate.toFixed(2)
        )}</td><td>$ ${numberWithCommas(
            tableArray[i].interestToDate.toFixed(2)
        )}</td></tr>`;
        balanceData.push(Number(tableArray[i].balance.toFixed(2)));
        balanceBgColor.push("rgba(255, 99, 132, 0.2)");
        balanceBorder.push("rgba(200, 99, 132, 1)");
        principalData.push(Number(tableArray[i].principalToDate.toFixed(2)));
        principalBgColor.push("rgba(7, 141, 14, 0.2)");
        principalBorder.push("rgba(7, 141, 14, 1)");
        interestData.push(Number(tableArray[i].interestToDate.toFixed(2)));
        interestBgColor.push("rgba(13, 103, 177, 0.2)");
        interestBorder.push("rgba(13, 103, 177, 1)");
    }
    // console.log(chartData);
    // console.log(tableArray, dateArray);
    setTimeout(() => {
        $(".tableContainer").fadeIn(500);
        $("#tableInfo").fadeIn(500);
    }, 1000);

    let chartData = {
        type: "bar",
        data: {
            labels: yearArray,
            datasets: [
                {
                    label: "Balance",
                    data: balanceData,
                    backgroundColor: balanceBgColor,
                    borderColor: balanceBorder,
                    borderWidth: 0.5,
                },
                {
                    label: "Principal to Date",
                    data: principalData,
                    backgroundColor: principalBgColor,
                    borderColor: principalBorder,
                    borderWidth: 0.5,
                },
                {
                    label: "Interest to Date",
                    data: interestData,
                    backgroundColor: interestBgColor,
                    borderColor: interestBorder,
                    borderWidth: 0.5,
                },
            ],
        },
        options: {
            tooltips: {
                mode: "index",
                intersect: false,
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
                xAxes: [{ gridLines: { display: false } }],
            },
        },
    };
    // FIX THIS FN BUUUUUG!
    // console.log(chartData.data);
    if (window.myChart !== undefined) {
        window.myChart.destroy();
    }

    var ctx = document.getElementById("tableInfo").getContext("2d");
    window.myChart = new Chart(ctx, chartData, {
        responsive: true,
    });
});

// START JS PDF

function addScript(url) {
    let script = document.createElement("script");
    script.type = "application/javascript";
    script.src = url;
    document.head.appendChild(script);
}
addScript(
    "https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"
);

let element = document.getElementById("calculatedTable");
let opt = {
    margin: 0.6,
    filename: "YourDragonTable.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
};

// New Promise-based usage:
function savePdf() {
    html2pdf().set(opt).from(element).save();
}

// // Old monolithic-style usage:
// html2pdf(element, opt);

// let doc = new jsPDF();

// doc.html(document.body, {
//   callback: function (doc) {
//     doc.save();
//   },
//   x: 10,
//   y: 10,
// });

// TODO: Validation, Chart, Get some whisky
// Emailjs, pdf converter

// Format the numbers to include or exclude commas
// Props to stack overflow

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberWithoutCommas(x) {
    return parseFloat(x.replace(/\$|,/g, ""));
}

// Props to Kentrichardson.com for providing these awesome functions
// Allows simple adjustments to the Date object

Date.prototype.adjust = function (part, amount) {
    part = part.toLowerCase();

    let map = {
        years: "FullYear",
        months: "Month",
        weeks: "Hours",
        days: "Hours",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        milliseconds: "Milliseconds",
        utcyears: "UTCFullYear",
        utcmonths: "UTCMonth",
        weeks: "UTCHours",
        utcdays: "UTCHours",
        utchours: "UTCHours",
        utcminutes: "UTCMinutes",
        utcseconds: "UTCSeconds",
        utcmilliseconds: "UTCMilliseconds",
    },
        mapPart = map[part];

    if (part == "weeks" || part == "utcweeks") amount *= 168;
    if (part == "days" || part == "utcdays") amount *= 24;

    this["set" + mapPart](this["get" + mapPart]() + amount);

    return this;
};

// Basically Date.forEach() from date x to date y. Calculates for leap years
Date.prototype.each = function (endDate, part, step, fn, bind) {
    let fromDate = new Date(this.getTime()),
        toDate = new Date(endDate.getTime()),
        pm = fromDate <= toDate ? 1 : -1,
        i = 0;

    while (
        (pm === 1 && fromDate <= toDate) ||
        (pm === -1 && fromDate >= toDate)
    ) {
        if (fn.call(bind, fromDate, i, this) === false) break;
        i += step;
        fromDate.adjust(part, step * pm);
    }
    return this;
};



