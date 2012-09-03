/**
 * Static graphs
 */
$('#data-panels .light .data-graph').each(function(){
    var data = [ { x: 0, y: 40 }, { x: 1, y: 45 }, { x: 1.1, y: 17 },{ x: 2, y: 17 }, {x: 2.1, y: 40 }, { x: 2.5, y: 45 }, { x: 3, y: 40 } ],
        graph = new Rickshaw.Graph( {
            element: $(this).get(0),
            //width: 200, //defaults to width of container
            height: 50,
            series: [ {
                    color: '#333',
                    data: data
            } ]
        } );

    graph.render();
});

$('#data-panels .ectds .data-graph').each(function(){
    var data = [ { x: 0, y: 20 }, { x: 2, y: 25 }, { x: 3, y: 26 }],
        graph = new Rickshaw.Graph( {
            element: $(this).get(0),
            //width: 200, //defaults to width of container
            height: 50,
            series: [ {
                    color: '#333',
                    data: data
            } ]
        } );

    graph.render();
});

$('#data-panels .water .data-graph').each(function(){
    var data = [ { x: 0, y: 20 }, { x: 2, y: 21 }, { x: 3, y: 20 }, { x: 4, y: 18 }],
        graph = new Rickshaw.Graph( {
            element: $(this).get(0),
            //width: 200, //defaults to width of container
            height: 50,
            series: [ {
                    color: '#333',
                    data: data
            } ]
        } );

    graph.render();
});

/**
 * Live graph
 * Override the Air graph w/ a live graph based on incoming (faked) data.
 * Note the FixedDuration series.
 */
//$('#data-panels .air .data-graph').empty(); //clear out the static graph create above
var tv = 500, //milliseconds
    i = 0,
    iv,
    airSeries = new Rickshaw.Series.FixedDuration([{ name: 'one', color: '#333' }], undefined, {
            timeInterval: tv,
            maxDataPoints: 20,
            timeBase: new Date().getTime() / 1000
        }),
    air_graph = new Rickshaw.Graph( {
        element: document.querySelector("#data-panels .air .data-graph"),
        height: 50,
        series: airSeries
    } ),
    main_graph = new Rickshaw.Graph( {
        element: document.querySelector("#main-data-graph"),
        //height: 300,
        series: new Rickshaw.Series.FixedDuration(
            [
                { name: 'one', color: 'rgba(0, 0, 0, .5)' }
            ], 
            undefined, 
            {
                timeInterval: tv,
                maxDataPoints: 200,
                timeBase: new Date().getTime() / 1000
            }
        )
    } );

// simulating live data updating
iv = setInterval( function() {

    var data = { one: Math.floor(Math.random() * 40) + 120 };

    var randInt = Math.floor(Math.random()*100);
    
    //to see what its like with multiple data series, uncomment
    //data.two = (Math.sin(i++ / 40) + 4) * (randInt + 400);
    //data.three = randInt + 300;

    air_graph.series.addData(data);
    air_graph.render();

    main_graph.series.addData(data);
    main_graph.render();

}, tv );




$(function () {
    //Bitponics.socket = io.connect(Bitponics.appUrl);
    Bitponics.socket = io.connect(window.location.origin);

    Bitponics.socket.on('sensor_event', function (data) {
            console.log('SOCKET EVENT');
            console.log(data);
            var point = [];
            point[0] = (new Date(data.timestamp)).getTime();
            point[1] = data.value;
            console.log(point);
            
        });
    Bitponics.socket.emit('client event', { my: 'data' });
});