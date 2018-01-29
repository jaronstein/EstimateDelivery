$(function() {
		  	var d = new Date();
		  	var city = '';
    		if(!localStorage.full_city)
    		{
    			city = getLocation();
    		}	
    		else
    		{
    			city = localStorage.full_city;
    		}
            alert(city);
            alert("Will arrive before: " + addDays(getShippingDay(d, 1, 13), getArrivalDays('doestn')) + " to " + city);

        	
        
        
        });
		  function getLocation()
		  {
		  	
        	$.ajax({
  				url:"https://freegeoip.net/json/"}).done( function(data, status) {
                   localStorage.full_city =  data.city + ", " + data.region_code;
                   
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
		  	alert(arrivalDays);
		  	if(!arrivalDays)
		  	{
		  	   arrivalDays = 3;
		  	}
		  	
		  	return arrivalDays;

		  }
