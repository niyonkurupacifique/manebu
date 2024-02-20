/**
 * Name: Education Mixed Education Form
 * Description: This logic define the behavior of the form fields
 * Author: Carlos Grant
 * Created Date: 2023-05-11
 */

const me = this;
const defaultCurrency = "RWF ";
const id = Number(window.location.href.split('/')[5]);


const LoadFormats = async ()=> {
    $('.date').flatpickr();
    if(isNaN(id)
 || id <= 0){        
        $('.money') .inputmask({ alias: 'currency', autoUnmask:true, prefix: defaultCurrency });
        return
    }

    const symbolQuery = `
        SELECT symbol FROM Currency c 
        INNER JOIN LifePolicy pol ON c.code = pol.currency
        WHERE pol.id =${ id }
    `
    const DoQuery = await me.exe('DoQuery',{sql: symbolQuery });
    const { ok, msg, outData } = DoQuery;
    if(!ok || outData.length == 0)
        console.warn(msg || 'No Symbol found');
    const symbol = outData[0]?.symbol + '  ' ?? defaultCurrency;
    $('.money') .inputmask({ alias: 'currency', autoUnmask:true, prefix: symbol });
}

const LoadUserData = ()=>{
    if($("#mpValuationDate").val()== ''){
        $("#mpValuationDate").val(formatDate(TODAY(),parseInt($("#Contribution-Years").val())));
    }

    if($("#reductionDate").val()==''){
        $("#reductionDate").val(formatDate(TODAY(),parseInt($("#Contribution-Years").val())));
    }
}

const setPeriodicity = () => {
    $("#periodicity").on("change", async function() {
        const value = $(this).val() == 'u' ? 'm12' : $(this).val();
        await me.exe("SetField", {
            entity: "LifePolicy",
            entityId: id,
            fieldValue: `periodicity='${value}'`,
          });
    });
}

const Init = async ()=>{
    await LoadFormats();
    LoadUserData();
    setPeriodicity();
    $('#Contribution-Years').on("change",function(e){
        $("#mpValuationDate").val(formatDate(TODAY(),parseInt($("#Contribution-Years").val())));
        $("#reductionDate").val(formatDate(TODAY(),parseInt($("#Contribution-Years").val())));

    });
}

Init();

/**
 * This function create a correct a format date to be used in the actuarial sheet for calculation
 * @param {datetime} date 
 * @param {number} plusYears 
 * @returns datetime
 */
function formatDate(date,plusYears=0) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = (d.getFullYear()+plusYears);

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
};