const me = this;
const defaultCurrency = "RWF ";
const id = Number(window.location.href.split('/')[5]);
// Variables to store the selected values
let selectedLoanType = "";
let selectedPolicyDuration = "";
let selectedPeriodicity = "";
let selectedReimbursementFrequency = "";


const LoadFormats = async () => {
  if (isNaN(id) || id <= 0) {        
    $('.money').inputmask({ alias: 'currency', autoUnmask: true, prefix: defaultCurrency });
    return;
  }

  const symbolQuery = `
    SELECT symbol FROM Currency c 
    INNER JOIN LifePolicy pol ON c.code = pol.currency
    WHERE pol.id = ${id}
  `;

  const DoQuery = await me.exe('DoQuery', { sql: symbolQuery });
  const { ok, msg, outData } = DoQuery;

  if (!ok || outData.length === 0) {
    console.warn(msg || 'No Symbol found');
  }

  const symbol = outData[0]?.symbol + ' ' ?? defaultCurrency;
  $('.money').inputmask({ alias: 'currency', autoUnmask: true, prefix: symbol });
};

const loadLoanDuration = async (limit) => {
  const GetFullTable = await me.exe("GetFullTable", { table: "tbLoanDurationInMonths" });
  const { outData: result } = GetFullTable;

  if (!result || result === null) return;

  const limits = result.slice(1); // Using `slice` instead of `splice` to create a new array
  const selectField = $("#policyDuration");

  selectField.empty().append("<option>Select</option>");

  limits.forEach((x) => {
    const option = `<option value="${x[0]}">${x[0]}</option>`;
    selectField.append(option);
  });

  if (limit) {
    selectField.val(limit);
  }
};


$(document).ready(function() {
  // Clear the periodicity and loanType fields


  // Event listener for loanType field
  $("#loanType").on("change", function() {
    selectedLoanType = $(this).val();
    var policyDurationField = $("#policyDuration");
    var periodicityField = $("#periodicity");
    var options = getPolicyDurationOptions(); // Retrieve the array of 300 values
    
    if (selectedLoanType === "Constant") {
      policyDurationField.empty(); // Clear existing options
      
      // Show the first 12 options
      for (var i = 0; i < 12; i++) {
        policyDurationField.append("<option value='" + options[i] + "'>" + options[i] + "</option>");
      }
    } else {
      policyDurationField.empty(); // Clear existing options
      
      // Show all options
      options.forEach(function(option) {
        policyDurationField.append("<option value='" + option + "'>" + option + "</option>");
      });
    }
    
    // Trigger the change event on policyDurationField to update the periodicityField options
    policyDurationField.trigger("change");
  });

  // Event listener for policyDuration field
  $("#policyDuration").on("change", function() {
  var selectedPolicyDuration = parseInt($(this).val());
  var periodicityField = $("#periodicity");

  periodicityField.empty(); // Clear all options

  if (selectedPolicyDuration <= 24) {
    periodicityField.append('<option value="Unique">Unique</option>'); // Add the "Unique" option
    periodicityField.val("Unique"); // Set the selected value as "Unique"
  } else {
    periodicityField.append('<option value="">Select</option>');
    periodicityField.append('<option value="Unique">Unique</option>');
    periodicityField.append('<option value="y">Annually</option>'); // Add the "Monthly" option
    periodicityField.append('<option value="s">Semi-Annually</option>'); // Add the "Quarterly" option
    periodicityField.append('<option value="q">Quarterly</option>'); // Add the "Yearly" option
    periodicityField.val(""); // Clear the selected value
  }
});

  // Event listener for loanType field (for loanReimbursFrequency select field)
  $("#loanType").on("change", function() {
  var selectedLoanType = $(this).val();
  var reimbursementFrequencyField = $("#loanReimbursFrequency");

  if (selectedLoanType === "Constant") {
    reimbursementFrequencyField.empty(); // Clear all options
    reimbursementFrequencyField.append('<option value="m">Monthly</option>'); // Add the "Monthly" option
  } else {
    reimbursementFrequencyField.empty(); // Clear all options
    reimbursementFrequencyField.append('<option value="m">Monthly</option>'); // Add the "Monthly" option
    reimbursementFrequencyField.append('<option value="q">Quarterly</option>'); // Add the "Quarterly" option
    reimbursementFrequencyField.append('<option value="s">Semi-Annually</option>'); // Add the "Yearly" option
    reimbursementFrequencyField.append('<option value="a">Annually</option>');
  }
});
  // Function to retrieve the array of 300 values for policy duration
  function getPolicyDurationOptions() {
    var options = [];
    for (var i = 1; i <= 300; i++) {
      options.push(i);
    }
    return options;
  }
  
  $("#loanType").val("Decreasing").trigger("change");
 
  // Call the necessary functions
  LoadFormats();
  loadLoanDuration();
  });
$("#loanType").on("change", function() {
  var selectedLoanType = $(this).val();
  var retrenchmentField = $("#retrenchmentOption");

  retrenchmentField.empty(); // Clear all options

  if (selectedLoanType === "Constant") {
    retrenchmentField.append('<option value="No">No</option>'); // Add the "No" option
    retrenchmentField.val("No");
  } else {
    retrenchmentField.append('<option value="No">No</option>');
    retrenchmentField.append('<option value="Yes">Yes</option>');
    retrenchmentField.val(""); // Clear the selected value
  }
});
  $(document).ready(function() {
  // Store the fields to toggle in a variable
  var fieldsToToggle = $("#partenerId, #phoneNumber, #lastName, #firstName");
  // Set the default value of #jointOption to "no" on document ready
  //$("#jointOption").val("no");
  // Function to handle the show/hide functionality
  function toggleFields() {
    var jointOption = $("#jointOption").val();

    if (jointOption === "yes") {
      fieldsToToggle.show();
    } else {
      fieldsToToggle.hide();
    }
  }
  // Call the toggleFields function on document ready
  toggleFields();
  // Event listener for #jointOption field
  $(document).on("change", "#jointOption", toggleFields);
});