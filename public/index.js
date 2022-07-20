//alert("Hello world");
// if income 
//     enter description and amount in all incomes 
//     add amount to income
//     money left=money left+amount
// if expense 
//    enter description and amount in all expenses 
//    add amount to expense
//    money left=money left - amount


//controller-function to control data where you can modify data however you want
// budget controller
var budgetController= (function(){

    //constructors-way to create objects 

    //expenses constructor
    function Expenses(id,description,value){
        this.id=id;
        this.desc=description;
        this.val=value;
    }

    //income constructor
    function Incomes(id,description,value)
    {
        this.id=id;
        this.desc=description;
        this.val=value;
    }

    //data structure to store data-array of objects
    var data ={ 
        AllIncExp:{inc:[],exp:[]},
        Totals: {inc:0,exp:0},
        Budget:0
     };

     //function to calculate the total income and expenditure based on type
     function calculateTotal(type){
        var sum=0;
        data.AllIncExp[type].forEach(function(val){
            sum+=val.val

        data.Totals[type] =sum;    
        })
     }

     return { // return an object
        //to generate a new item
        generateItem: function (type,desc,val){ //function to create ids
                        var addItem, ID; //id=id of last element+1
                        if(data.AllIncExp[type].length > 0)
                        {
                            ID = data.AllIncExp[type][data.AllIncExp[type].length -1].id+1
                        }
                        else ID = 0;

                        if(type === 'inc')
                        addItem = new Incomes(ID, desc,val);
                        else if (type=== 'exp')
                        addItem = new Expenses(ID, desc,val);

                        data.AllIncExp[type].push(addItem);
                        return addItem;
                    },

        //to delete an item            
        deleteItem : function(type,id){
            //find the index of the item to be deleted ,use splice function to delete the item
            var index;
            //map function creates a new array by performing the mentioned function on each element of the mentioned array
            var ids= data.AllIncExp[type].map(function(cur){
                return cur.id;
            })

            index= ids.indexOf(id);

            if(index!= -1)
                data.AllIncExp[type].splice(index,1); //splice(position,how many elements)
        },
        
        calculateBudget : function(){

            //calculate total income and total expenditure
            calculateTotal('inc');
            calculateTotal('exp');
            //budget = income-expense
            data.Budget = data.Totals.inc - data.Totals.exp;

        },

        getBudget : function(){
            return {
                totalBudget :data.Budget,
                totalIncome : data.Totals.inc,
                totalExpense : data.Totals.exp
            }
        }

                    
     }
})();

//UI controller

var UIController =(function(){

    // get data classes of html elements
    var getDataClasses= {
        type : ".select-box",
        description:".des-box",
        value:".value-box",
        add: ".add",
        incomeContainer:".income-div",
        expenseContainer:".expense-div",
        totalIncome:".total-income",
        totalExpense:".total-exp",
        moneyLeft:".money-left",
        mainContainer:".container1",
        date:".date"
    }

    return {
// store values of type(inc/exp),description and amount
        inputData:function(){
            return {
                type:document.querySelector(getDataClasses.type).value,
                description:document.querySelector(getDataClasses.description).value,
                value:parseFloat(document.querySelector(getDataClasses.value).value)
            }
         
        },

        dataClasses: function(){
            return getDataClasses;
        },
// to add elements on clicking add button
        addListItems: function(obj,type) {
            var html,htmlElement;
            if(type==='inc')
            {
                htmlElement = getDataClasses.incomeContainer;
                // template literal to add html $-javascript identifier used as a placeholder for js expression inside template literal
                html =`<div id="inc-${obj.id}"> 
                <h3>${obj.id+1}. ${obj.desc} <span style="text-align:right"><h4>Rs.${obj.val}</h4></span></h3>
                </div>`;
                console.log(obj.id);

            } else if(type==='exp')
            {
                htmlElement = getDataClasses.expenseContainer;
                // template literal to add html $-javascript identifier used as a placeholder for js expression inside template literal
                html =  
                `<div id="exp-${obj.id}"> 
                <h3>${obj.id+1}. ${obj.desc} <span style="text-align:right"><h4>Rs.${obj.val}</h4></span></h3>
                </div>`;
            }
// insertAdjacentHTML is a method used to insert a code at specified position
            document.querySelector(htmlElement).insertAdjacentHTML("beforeend",html);

            //clear input fields
            var fieldData=document.querySelectorAll(`${getDataClasses.description},${getDataClasses.value}`);
            fieldData.forEach(element=>{
                element.value='';
            });
            fieldData[0].focus();
        },
       //to update the amount value in the main container
        displayBudget: function(obj){
            document.querySelector(getDataClasses.moneyLeft).textContent = obj.totalBudget;
            document.querySelector(getDataClasses.totalIncome).textContent = "+ "+ obj.totalIncome;
            document.querySelector(getDataClasses.totalExpense).textContent = "- "+ obj.totalExpense;
        },

        delListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            //removes child element with this id
            el.parentNode.removeChild(el);
        },

        displayDate: function(){
            var dateElement = document.querySelector(getDataClasses.date);
            var months =['January','February','March','April','May','June','July','August','September','October','November','December'];
            var date= new Date();
            var datenumber= date.getDate();
            var month = date.getMonth(); //returns a number bw 0-11
            month=months[month];
            var year= date.getFullYear();
            dateElement.textContent=`${datenumber} ${month},${year}`;
        }


        




    };
    
})();


//trigger all actions

var trigger = (function (budgetCntrl,UICntrl){
    var eventHandler = function(){
        //store the data of class names
        var dataCl=UICntrl.dataClasses();
        document.querySelector(dataCl.add).addEventListener("click",triggerCtrl);

        document.addEventListener("keypress",function(e){
            //what does this do?
            if(e.keyCode === 13 || e.which === 13) {
                triggerCtrl();
            }
        });

        document.querySelector(dataCl.mainContainer).addEventListener('click',ctrlDeleteItem)
    };

    function updateBudget()
    {
        //1.Calculate budget.
        budgetCntrl.calculateBudget();

        //2.Return the budget
        var budget = budgetCntrl.getBudget();

        //update budget in UI
        UICntrl.displayBudget(budget);
    }

    function ctrlDeleteItem(event) {
        var getElemetID = event.target.parentNode.parentNode.id;
        var splittedID = getElemetID.split('-');
        var type = splittedID[0];
        var ID = parseInt(splittedID[1]);
    
        //delete item from data structure
        budgetCntrl.deleteItem(type, ID);
    
        //delete item from the UI
        UICntrl.delListItem(getElemetID);
        //show the updated budget
        updateBudget();
        
      }

      var triggerCtrl = function() {
          // 1. Get the data from the input field.
    var inputValues = UICntrl.inputData();

    //check either the fields are empty or have data
    if (inputValues.description != "" && !isNaN(inputValues.value) && inputValues.value > 0) {
      // 2. Add data to the budget controller.
      var newItem = budgetCntrl.
      generateItem(inputValues.type, inputValues.description, inputValues.value);
      // 3. Add new item to the UI.
      UICntrl.addListItems(newItem, inputValues.type);
      //4. Update the budget
      updateBudget();
      }
    };
    return {
        init: function (){
            UICntrl.displayDate();
            eventHandler();
        }
    }

})(budgetController,UIController);

//to initialise the application
trigger.init();

