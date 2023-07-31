const toggler = document.querySelector(".btn");

toggler.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("collapsed");
  document.querySelector("#sidebar").classList.remove("hide_sidebar");
});

const viewPortWidth = window.innerWidth;

if (viewPortWidth <= 980) {
  document.querySelector("#sidebar").classList.add("hide_sidebar");
}

//---------------- Main Script for Charts ----------------------
let SHEET_ID = "1CwrWdik8Q7Rg0eIjIoCLwom5dgdGNWFxtou0npbbFYw";
const base = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?`;
let SHEET_TITLE1 = "Garbage Groups";
let SHEET_TITLE2 = "Destination Facilities ";
let SHEET_TITLE3 = "Trucks Counter";
let SHEET_TITLE4 = "Garbage Counter";
const qu1 = "Select *";
const qu2 = "Select *";
const qu3 = "Select *";
const qu4 = "Select *";
const query1 = encodeURIComponent(qu1);
const query2 = encodeURIComponent(qu2);
const query3 = encodeURIComponent(qu3);
const query4 = encodeURIComponent(qu4);
const url1 = `${base}&sheet=${SHEET_TITLE1}&tq=${query1}`;
const url2 = `${base}&sheet=${SHEET_TITLE2}&tq=${query2}`;
const url3 = `${base}&sheet=${SHEET_TITLE3}&tq=${query3}`;
const url4 = `${base}&sheet=${SHEET_TITLE4}&tq=${query4}`;

let dataa = [];
let destinationdataa = [];
let truckCounterdataa = [];
let garbageCounterdataa = [];
let myChart1 = null; // Variable to store the Chart instance
let myChart2 = null; // Variable to store the Chart instance
let myChart3 = null; // Variable to store the Chart instance

document.addEventListener("DOMContentLoaded", fetchData);
// document.addEventListener("DOMContentLoaded", destinationFacilityAPIFunction);

// Function When No Data Found
function noDataFound(data, canvasId) {
  console.log(data, canvasId);
  if (!data || data.length === 0) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText("No Data Found", ctx.canvas.width / 2, ctx.canvas.height / 2);
    return;
  }
}
//--------------------   Buildings Chart Function ------------------------
function displayBuildingsChart(data, canvasId) {
  // Destroy the previous Chart instance if it exists
  if (myChart1) {
    myChart1.destroy();
  }
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (!data || data.length === 0) {
    return noDataFound(data, canvasId);
  }
  noDataFound(data, canvasId);
  const labels = data?.map((row) => row.c[2]?.v);
  const values = data?.map((row) => row.c[1]?.v); // Assuming data is in the second column (index 1)

  // Calculate the sum for each label
  const sumByLabel = labels.reduce((acc, label, index) => {
    acc[label] = (acc[label] || 0) + values[index];
    return acc;
  }, {});
  // Extract the unique labels and summed values
  const uniqueLabels = Object.keys(sumByLabel);
  const summedValues = Object.values(sumByLabel);

  const labelSets = new Set(uniqueLabels);
  const arrayOfLabels = Array.from(labelSets);

  const valueSets = new Set(summedValues);
  const arrayOfValues = Array.from(valueSets);

  // Calculate the maximum value (1500 or the actual max value, whichever is larger)
  const maxValue = Math.max(Math.max(...summedValues), 1500);

  // Calculate percentages of values relative to 1500
  const percentages = arrayOfValues.map((value) => (value / maxValue) * 100);

  const buildingText = {
    id: "building",
    beforeDraw(chart) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;

      const fontSize = 15; // Adjust the font size as needed
      const buildingText = "Building";
      const valueText = arrayOfValues.reduce((acc, value) => {
        return acc + `${value}`;
      }, "");

      const textX = width / 2;
      const textY = height / 2 + fontSize / 2 + 20; // Adjust the position as needed

      ctx.save();
      ctx.font = `bolder ${fontSize}px Arial`;
      ctx.fillStyle = "#444";
      ctx.textAlign = "center";
      ctx.fillText(valueText, textX, textY + fontSize); // Adjust the
      ctx.fillText(buildingText, textX, textY);
    },
  };

  const firstValuePercentage = (percentages[0] / 100).toFixed(2);
  const secondValuePercentage = ((100 - percentages[0]) / 100).toFixed(2);

  const chartData = [firstValuePercentage, secondValuePercentage];
  myChart1 = new Chart(ctx, {
    type: "doughnut",
    options: {
      cutout: "70%",
      plugins: {
        tooltip: {
          enabled: false, // Disable the tooltip on hover
        },
      },
    },
    data: {
      labels: arrayOfLabels,
      datasets: [
        {
          label: "Data",
          data: chartData,
          backgroundColor: ["rgb(255, 99, 132)", "rgba(128,128,128, 0.25)"],
          borderWidth: 0,
        },
      ],
    },
    plugins: [buildingText],
  });
}

//--------------------   Trimming Chart Function ------------------------
function displayTrimmingChart(data, canvasId) {
  // Destroy the previous Chart instance if it exists
  if (myChart3) {
    myChart3.destroy();
  }
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (!data || data.length === 0) {
    return noDataFound(data, canvasId);
  }
  const labels = data?.map((row, index) => row.c[2]?.v);
  const values = data?.map((row, index) => row.c[1]?.v); // Assuming data is in the second column (index 1)

  // Calculate the sum for each label
  const sumByLabel = labels.reduce((acc, label, index) => {
    acc[label] = (acc[label] || 0) + values[index];
    return acc;
  }, {});

  // Extract the unique labels and summed values
  const uniqueLabels = Object.keys(sumByLabel);
  const summedValues = Object.values(sumByLabel);

  const labelSets = new Set(uniqueLabels);
  const arrayOfLabels = Array.from(labelSets);

  const valueSets = new Set(summedValues);
  const arrayOfValues = Array.from(valueSets);

  //  Calculate the maximum value (1500 or the actual max value, whichever is larger)
  const maxValue = Math.max(Math.max(...summedValues), 1500);

  // Calculate percentages of values relative to 1500
  const percentages = arrayOfValues.map((value) => (value / maxValue) * 100);

  const trimmingsText = {
    id: "trimmings",
    beforeDraw(chart) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;

      const fontSize = 15; // Adjust the font size as needed
      const buildingText = "Trimmings";
      const valueText = arrayOfValues.reduce((acc, value) => {
        return acc + `${value}`;
      }, "");

      const textX = width / 2;
      const textY = height / 2 + fontSize / 2 + 20; // Adjust the position as needed

      ctx.save();
      ctx.font = `bolder ${fontSize}px Arial`;
      ctx.fillStyle = "#444";
      ctx.textAlign = "center";
      ctx.fillText(valueText, textX, textY + fontSize); // Adjust the
      ctx.fillText(buildingText, textX, textY);
    },
  };
  const firstValuePercentage = (percentages[0] / 100).toFixed(2);
  const secondValuePercentage = ((100 - percentages[0]) / 100).toFixed(2);

  const chartData = [firstValuePercentage, secondValuePercentage];

  myChart3 = new Chart(ctx, {
    type: "doughnut",
    options: {
      cutout: "70%",
      plugins: {
        tooltip: {
          enabled: false, // Disable the tooltip on hover
        },
      },
    },
    data: {
      labels: arrayOfLabels,
      datasets: [
        {
          label: "Data",
          data: chartData,
          backgroundColor: ["rgb(255, 206, 86)", "rgba(128,128,128, 0.25)"],
          borderWidth: 0,
        },
      ],
    },
    plugins: [trimmingsText],
  });
}

//--------------------   HouseHolding Chart Function ------------------------
function displayHouseholdingChart(data, canvasId) {
  // Destroy the previous Chart instance if it exists
  if (myChart2) {
    myChart2.destroy();
  }
  const ctx = document.getElementById(canvasId).getContext("2d");

  if (!data || data.length === 0) {
    return noDataFound(data, canvasId);
  }
  const labels = data?.map((row) => row.c[2]?.v);
  const values = data?.map((row) => row.c[1]?.v); // Assuming data is in the second column (index 1)

  // Calculate the sum for each label
  const sumByLabel = labels.reduce((acc, label, index) => {
    acc[label] = (acc[label] || 0) + values[index];
    return acc;
  }, {});

  // Extract the unique labels and summed values
  const uniqueLabels = Object.keys(sumByLabel);
  const summedValues = Object.values(sumByLabel);

  const labelSets = new Set(uniqueLabels);
  const arrayOfLabels = Array.from(labelSets);

  const valueSets = new Set(summedValues);
  const arrayOfValues = Array.from(valueSets);

  // Calculate the maximum value (1500 or the actual max value, whichever is larger)
  const maxValue = Math.max(Math.max(...summedValues), 1500);

  // Calculate percentages of values relative to 1500
  const percentages = arrayOfValues.map((value) => (value / maxValue) * 100);

  const houseHoldingsText = {
    id: "houseHoldings",
    beforeDraw(chart) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;

      const fontSize = 15; // Adjust the font size as needed
      const buildingText = "HouseHoldings";
      const valueText = arrayOfValues.reduce((acc, value, index) => {
        return acc + `${value}`;
      }, "");

      const textX = width / 2;
      const textY = height / 2 + fontSize / 2 + 20; // Adjust the position as needed

      ctx.save();
      ctx.font = `bolder ${fontSize}px Arial`;
      ctx.fillStyle = "#444";
      ctx.textAlign = "center";
      ctx.fillText(valueText, textX, textY + fontSize); // Display percentage
      ctx.fillText(buildingText, textX, textY);
    },
  };
  const firstValuePercentage = (percentages[0] / 100).toFixed(2);
  const secondValuePercentage = ((100 - percentages[0]) / 100).toFixed(2);

  const chartData = [firstValuePercentage, secondValuePercentage];
  console.log(percentages);
  myChart2 = new Chart(ctx, {
    type: "doughnut",
    options: {
      cutout: "70%",
      plugins: {
        tooltip: {
          enabled: false, // Disable the tooltip on hover
        },
      },
    },
    data: {
      labels: arrayOfLabels,
      datasets: [
        {
          label: "Data",
          data: chartData,
          backgroundColor: ["rgb(54, 162, 235)", "	rgba(128,128,128, 0.25)"],
          borderWidth: 0,
        },
      ],
    },
    plugins: [houseHoldingsText],
  });
}

// ------------------ Destination Facility Function ------------------------
function destinationFacilityFunction(dataaaaaaaaa) {
  console.log(dataaaaaaaaa);
  // Check if data is empty
  if (!dataaaaaaaaa || dataaaaaaaaa.length === 0) {
    const destinationFacilityDataContainer = document.getElementById(
      "destinationFacilityDataContainer"
    );
    destinationFacilityDataContainer.innerHTML = "<p>No Data Found</p>";
    return;
  }
  const labels = dataaaaaaaaa?.map((row) => row.c[2]?.v);
  const values = dataaaaaaaaa?.map((row) => row.c[1]?.v);

  // Calculate the sum for each label
  const sumByLabel = labels.reduce((acc, label, index) => {
    acc[label] = (acc[label] || 0) + values[index];
    return acc;
  }, {});

  // Extract the unique labels and summed values
  const uniqueLabels = Object.keys(sumByLabel);
  const summedValues = Object.values(sumByLabel);

  const labelSets = new Set(uniqueLabels);
  const arrayOfLabels = Array.from(labelSets);

  const valueSets = new Set(summedValues);
  const arrayOfValues = Array.from(valueSets);

  let destinationFacilityArray = [];
  let bgcolors = [
    "rgba(54, 162, 235, 0.2)",
    "rgba(4, 62, 235, 0.2)",
    "rgba(255, 99, 132, 0.2)",
    "rgba(255, 9, 32, 0.2)",
    "rgba(255, 99, 1, 0.2)",
  ];
  const icons = [
    "./icons/ecology.svg",
    "./icons/mafridan.svg",
    "./icons/buildingWaste.svg",
    "./icons/trimming.svg",
    "./icons/RDF.svg",
  ];
  for (let i = 0; i < arrayOfLabels.length; i++) {
    let obj = {
      name: arrayOfLabels[i],
      value: arrayOfValues[i],
      bgColor: bgcolors[i],
      icon: icons[i],
    };
    destinationFacilityArray.push(obj);
  }

  let destinationContent = destinationFacilityArray
    ?.map((item) => {
      return `
      <div class="col-sm-12 col-md-6 col-lg-4 mt-3">
      <div
        class="p-3 border top-content d-flex flex-column justify-content-center align-items-center"
      >
      <img src=${item.icon} alt="goal" style='height: 100px; width: 150px'/>
        <h3>${item.name}</h3>
        <h2 class='destinationFacCol' style='color: #F39324' data-val=${item.value}>${item.value}</h2>
      </div>
    </div>
    `;
    })
    .join("");

  // Display the HTML content in the destinationFacilityDataContainer
  const destinationFacilityDataContainer = document?.getElementById(
    "destinationFacilityDataContainer"
  );
  destinationFacilityDataContainer.innerHTML = destinationContent;
  const destinationFacCols = document?.querySelectorAll(".destinationFacCol");
  
  destinationFacCols?.forEach((destinationFacCol) => {
    let startValue = 0;
    let endValue = parseInt(destinationFacCol.getAttribute("data-val"));
    let duration = Math.floor(1 / endValue);
    let counter = setInterval(() => {
      startValue += 1;
      destinationFacCol.textContent = startValue;
      if (startValue == endValue) {
        clearInterval(counter);
      }
    }, duration);
  });
}

// ----------------- Truck Counter function ---------------------
function truckCounterFunction(truckRecordsData) {
  // Handle data for the Trucks Counter tab
  const truckNumbers = document.getElementById("truckNumbers");
  if (truckRecordsData) {
    if (truckRecordsData.length === 0) {
      truckNumbers.innerHTML = "0";
    } else {
      const totalTruckRecords = truckRecordsData?.reduce((acc, row) => {
        // Assuming the truck count is in the first column (index 0)
        const count = row.c[0]?.v || 0;
        return acc + count;
      }, 0);

      let startValue = 0;
      let endValue = totalTruckRecords;
      let duration = Math.floor(1 / endValue);
      console.log(duration);
      let counter = setInterval(() => {
        startValue += 1;
        truckNumbers.textContent = startValue;
        if (startValue == endValue) {
          clearInterval(counter);
        }
      }, duration);
      truckNumbers.innerHTML = totalTruckRecords;
    }
  }
}

// ----------------- Garbage Counter function ---------------------
function garbageCounterFunction(garbageRecordsData) {
  const garbageTons = document.getElementById("garbageTons");
  if (garbageRecordsData) {
    if (garbageRecordsData.length === 0) {
      garbageTons.innerHTML = "0";
    } else {
      const totalGarbageRecords = garbageRecordsData?.reduce((acc, row) => {
        // Assuming the truck count is in the second column (index 1)
        const count = row.c[1]?.v || 0;
        return acc + count;
      }, 0);
      let startValue = 0;
      let endValue = totalGarbageRecords;
      let duration = Math.floor(1 / endValue);
      let counter = setInterval(() => {
        startValue += 1;
        garbageTons.textContent = startValue;
        if (startValue == endValue) {
          clearInterval(counter);
        }
      }, duration);
      garbageTons.innerHTML = totalGarbageRecords;
    }
  }
}

//------------------- API call to Google Sheet Function For Garbaged Group and Destination Facility ---------------------

//------------------- API call to Google Sheet Function For Garbaged Group ---------------------
async function fetchGarbagedGroupData() {
  const response = await fetch(url1);
  const text = await response.text();
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");
  const jsonData = text.slice(startIndex, endIndex + 1);
  return JSON.parse(jsonData);
}

//------------------- API call to Google Sheet Function For Destination Facility ---------------------
async function fetchDestinationFacilityData() {
  const response = await fetch(url2);
  const text = await response.text();
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");
  const jsonData = text.slice(startIndex, endIndex + 1);
  return JSON.parse(jsonData);
}

//------------------- API call to Google Sheet Function For Trucks Counter ---------------------
async function fetchTrucksCounterData() {
  const response = await fetch(url3);
  const text = await response.text();
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");
  const jsonData = text.slice(startIndex, endIndex + 1);
  return JSON.parse(jsonData);
}
//------------------- API call to Google Sheet Function For Garbage Counter ---------------------
async function fetchGarbageCounterData() {
  const response = await fetch(url4);
  const text = await response.text();
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");
  const jsonData = text.slice(startIndex, endIndex + 1);
  return JSON.parse(jsonData);
}

//------------------- Fetch Data for All tabs ---------------------
async function fetchData() {
  try {
    const [
      garbagedGroupData,
      destinationFacilityData,
      trucksCounterData,
      garbageCounterData,
    ] = await Promise.all([
      fetchGarbagedGroupData(),
      fetchDestinationFacilityData(),
      fetchTrucksCounterData(),
      fetchGarbageCounterData(),
    ]);
    console.log(garbagedGroupData);
    // Separate data for "Building," "Trimmings," and "Households" from the Garbaged Group tab
    const dataBuilding = garbagedGroupData?.table?.rows?.filter(
      (row) => row.c[2]?.v === "Building"
    );
    const dataTrimmings = garbagedGroupData?.table?.rows?.filter(
      (row) => row.c[2]?.v === "Trimmings"
    );
    const dataHouseholds = garbagedGroupData?.table?.rows?.filter(
      (row) => row.c[2]?.v === "Household"
    );
    if (garbagedGroupData?.table?.rows) {
      // Append the new data to the existing data array
      dataa.push(...garbagedGroupData.table.rows);
    }
    // Display pie charts for each category from the Garbaged Group tab
    displayBuildingsChart(dataBuilding, "chartBuilding");
    displayTrimmingChart(dataTrimmings, "chartTrimmings");
    displayHouseholdingChart(dataHouseholds, "chartHouseholds");

    // Handle data for the Destination Facilities tab
    if (destinationFacilityData?.table?.rows) {
      // Append the new data to the existing data array
      destinationdataa.push(...destinationFacilityData.table.rows);
      destinationFacilityFunction(destinationFacilityData?.table?.rows);
    }

    // Handle data for the Trucks Counter tab
    if (trucksCounterData?.table?.rows) {
      // Calculate the total number of truck records
      truckCounterdataa.push(...trucksCounterData.table.rows);
      truckCounterFunction(trucksCounterData.table.rows);
    }

    // Handle data for the Trucks Counter tab
    if (garbageCounterData?.table?.rows) {
      // Calculate the total number of truck records
      garbageCounterdataa.push(...garbageCounterData.table.rows);
      garbageCounterFunction(garbageCounterData.table.rows);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function filterChartData() {
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  // Filter data based on the selected time range
  const filteredData = dataa?.filter((row, index) => {
    const rowDataTime = row?.c[0]?.f; // Assuming the time data is in the first column (index 0)
    const rowTime = rowDataTime.substring(0, rowDataTime.length - 3);

    return rowTime >= startTime && rowTime <= endTime;
  });

  // Destination Facility Filter
  const destinationFilteredData = destinationdataa?.filter((row, index) => {
    const rowDataTime = row?.c[0]?.f; // Assuming the time data is in the first column (index 0)
    const rowTime = rowDataTime.substring(0, rowDataTime.length - 3);

    return rowTime >= startTime && rowTime <= endTime;
  });

  // Truck Counter Filtered Data
  const truckCounterFilteredData = truckCounterdataa?.filter((row, index) => {
    const rowDataTime = row?.c[1]?.f; // Assuming the time data is in the first column (index 0)
    const rowTime = rowDataTime.substring(0, rowDataTime.length - 3);

    return rowTime >= startTime && rowTime <= endTime;
  });

  // Truck Counter Filtered Data
  const garbageCounterFilteredData = garbageCounterdataa?.filter(
    (row, index) => {
      const rowDataTime = row?.c[0]?.f; // Assuming the time data is in the first column (index 0)
      const rowTime = rowDataTime.substring(0, rowDataTime.length - 3);

      return rowTime >= startTime && rowTime <= endTime;
    }
  );
  console.log(
    filteredData,
    destinationFilteredData,
    truckCounterFilteredData,
    garbageCounterFilteredData
  );
  // Separate data for "Building," "Trimmings," and "Households"
  const dataBuilding = filteredData?.filter(
    (row) => row.c[2]?.v === "Building"
  );
  const dataTrimmings = filteredData?.filter(
    (row) => row.c[2]?.v === "Trimmings"
  );
  const dataHouseholds = filteredData?.filter(
    (row) => row.c[2]?.v === "Household"
  );
  // Display pie charts for each category
  displayBuildingsChart(dataBuilding, "chartBuilding");
  displayTrimmingChart(dataTrimmings, "chartTrimmings");
  displayHouseholdingChart(dataHouseholds, "chartHouseholds");

  // passing filtered data to Destination Facility Function
  destinationFacilityFunction(destinationFilteredData);

  // Passing Truck Data to TruckCounterFunction
  truckCounterFunction(truckCounterFilteredData);

  // Passing Truck Data to TruckCounterFunction
  garbageCounterFunction(garbageCounterFilteredData);
}

// Function to check if the start and end time inputs have values and enable/disable the filter button accordingly
function updateFilterButtonState() {
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const filterButton = document.getElementById("filterButton");

  // Get the values of the input fields
  const startTimeValue = startTimeInput.value;
  const endTimeValue = endTimeInput.value;

  // Check if either of the input fields is empty
  const isEitherInputEmpty =
    startTimeValue.trim() === "" || endTimeValue.trim() === "";

  // Enable or disable the filter button based on the condition
  filterButton.disabled = isEitherInputEmpty;
  filterButton.classList.add("disabled");
  if (startTimeValue.trim() !== "" && endTimeValue.trim() !== "") {
    filterButton.classList.remove("disabled");
  }
}

// Add event listeners to the filter inputs to update the button state on input changes
document
  .getElementById("startTime")
  .addEventListener("input", updateFilterButtonState);
document
  .getElementById("endTime")
  .addEventListener("input", updateFilterButtonState);
