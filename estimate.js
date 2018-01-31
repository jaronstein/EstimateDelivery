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
					$(data).insertAfter('.product-price__price'); 
				}

				var deliveryDate = addDays(getShippingDay(d, 1, 13), getArrivalDays('doestn'));
				deliveryDate = deliveryDate.toString().substring(0,10).replace(' ', ', ');

				if(deliveryDate.substring(9,10) == "0")
				{

					deliveryDate = deliveryDate.replace('0', '');
				}
				$('#deliveryDate').html(deliveryDate + " to ");
				$('.zipCodeField').val(localStorage.zip);
				$('#deliveryLocation').html(city);
				$('#estimatedDeliveryForm').hide();

				$('.dateWrapper').show();
			});
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
			function addDays(date, toAdd)
			{
				date = new Date(date);
				date.setDate(date.getDate() + toAdd);
				if(date.getDay() == 0 || date.getDay() == 6)
				{
					return addDays(date, 1);
				}
				return date;
			}
			function getArrivalDays(currentLocation)
			{
				var arrivalDays = localStorage.arrivalDays;

				if(!arrivalDays)
				{
					$.get('http://estimateddeliveryapi20180131024544.azurewebsites.net/api/Estimate?zip=78703
					      , function(data){ arrivalDays = data; 
							      return arrivalDays;});
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
