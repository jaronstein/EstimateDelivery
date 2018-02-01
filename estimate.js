		$(function() {

			var city = '';
			var zip = '';
			if(!localStorage.full_city)
			{
				city = getLocation();
			}	
			else
			{
				city = localStorage.full_city;


			}
			zip = localStorage.zip;
			showEstimatedDelivery(city, true);




		});
		function showEstimatedDelivery(city, newForm)
		{
			var d = new Date();


			$.get('https://raw.githubusercontent.com/jaronstein/EstimateDelivery/master/DeliveryBlock.html', function(data){
				if(newForm)
				{
					if(window.location.pathname.indexOf('products') > 0)
						$(data).insertAfter('.product-price__price');
					else if (window.location.pathname.indexOf('cart') > 0)
						$(data.insertAfter('list-view-item__title'));	
				}
                getArrivalDays(localStorage.zip, !newForm);
                //var arrivalDays = getArrivalDays(localStorage.zip, !newForm);
                //var deliveryDate = addDays(getShippingDay(d, 1, 13), arrivalDays);
				//deliveryDate = deliveryDate.toString().substring(0,10).replace(' ', ', ');
				
			});
		}
		function displayDate(deliveryDate, city)
		{		 
          
				if(deliveryDate.substring(9,10) == "0")
				{

					deliveryDate = deliveryDate.replace('0', '');
				}
				$('#deliveryDate').html(deliveryDate + " to ");
				$('.zipCodeField').val(localStorage.zip);
				$('#deliveryLocation').html(city);
				$('#estimatedDeliveryForm').hide();

				$('.dateWrapper').show();
		}
		function getLocation()
		{

			$.ajax({
				url:"https://freegeoip.net/json/"}).done( function(data, status) {
					localStorage.full_city =data.city + ", " + data.region_code;
					localStorage.zip = data.zip_code;
					$('.zipCodeField').val(data.zip_code);
					return data.city + ", " + data.region_code;
				})
				.fail(function(data, status, error) {

				});
			}
			function getShippingDay(date, numHandlingDays, cutOffHour)
			{
				date = new Date(date);
				var currentDay = date.getDay();

				if(currentDay != 0 && currentDay != 6)
				{
					if(date.getHours() > cutOffHour)
					{
						numHandlingDays = numHandlingDays + 1;
						date.setHours(0);
					}
					if(numHandlingDays == 0)
					{
						return date;
					}
					else
					{
						return addDays(date, numHandlingDays);
					}
				}
				else
				{
					return getShippingDay(date.setDate(date.getDate() + 1), numHandlingDays, cutOffHour);
				}
			}
			/*function addDays(date, toAdd)
			{
				
				date = new Date(date);
                toAdd = parseInt(toAdd);
				console.log("adding days");
				console.log(date.getDate());
				console.log(toAdd);
                console.log(date.getDate() + toAdd);
                var amountToAdd = date.getDate() + toAdd;
				date = date.setDate(date.getDate() + toAdd);
				date = new Date(date);
				console.log('set date called');
				console.log(date);

				if(date.getDay() == 0 || date.getDay() == 6)
				{
					console.log("recursing");
					return addDays(date, 1);
				}
				return date;
			}*/
			function addDays(date, daysToAdd)
			{
				daysToAdd = parseInt(daysToAdd);
				for(var i = 0; i<daysToAdd;)
				{
					date = date.setDate(date.getDate() + 1);
					date = new Date(date);
					if(date.getDay() != 0 && date.getDay() != 6)
						i++;
				}
				return date;
			}
			function getArrivalDays(zip, reSubmit)
			{

				var arrivalDays = localStorage.arrivalDays;
				
				if(!arrivalDays || reSubmit)
				{
					
					$.get('http://estimateddeliveryapi20180131024544.azurewebsites.net/api/Estimate?zip=' + zip
					      , function(data){ arrivalDays = parseInt(data); 
					      	localStorage.arrivalDays = arrivalDays;
					      	    
					      	     var deliveryDate = addDays(getShippingDay(new Date(), 1, 13), arrivalDays);
					      	     deliveryDate = deliveryDate.toString().substring(0,10).replace(' ', ', ');
					      	     displayDate(deliveryDate, localStorage.full_city);
							      return arrivalDays;});
				}
				else
				{
					
               	 	var deliveryDate = addDays(getShippingDay(new Date(), 1, 13), arrivalDays);
					deliveryDate = deliveryDate.toString().substring(0,10).replace(' ', ', ');
					displayDate(deliveryDate, localStorage.full_city);
				}

				return arrivalDays;

			}
			function showForm()
			{
				$('#estimatedDeliveryForm').show();
				$('.dateWrapper').hide();

			}
			function submitForm(zip)
			{
				
				$.get('http://ziptasticapi.com/' + zip, function(data){
					data = JSON.parse(data);
					
					localStorage.full_city =data.city + ", " + data.state;
					localStorage.zip = zip;
					showEstimatedDelivery(data.city + ", " + data.state, false);

				});
			}

