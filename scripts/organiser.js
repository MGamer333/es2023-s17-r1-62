/**
 * Constant variables
 * for the functions' working
 */
var workspaceLoaded = false;
var workspace = document.getElementById( "workspace" );
var deleteMode = false;
var exportedTextarea = document.getElementById( "exported" );


/* Link handler function */
for ( let link of document.getElementsByClassName( "scroll-link" ) )
{
    link.addEventListener( "click", () => {
        window.location.href = link.dataset.link;
    })
}


/* Save seats from local storage */
const save = () => {
    let array = [];

    for ( let item of document.querySelectorAll( ".seat" ) )
    {
        if ( item.childElementCount == 1 )
        {
            array.push({
                x: item.dataset.x,
                y: item.dataset.y,
                name: item.children[0].value
            });
        }
    }

    if ( array.length > 0 )
    {
        localStorage.setItem( 'savedSeats', JSON.stringify( array ) );
    }
    else
    {
        localStorage.removeItem( 'savedSeats' );
    }
}


/* Load seats from local storage */
const load = () => {
    if ( localStorage.getItem( 'savedSeats' ) !== null )
    {
        let parsedSeats = JSON.parse( localStorage.getItem( 'savedSeats' ) );

        clearAllSeat(false);
        parsedSeats.forEach( element => {
            let tmp = generateSpan( element.name );
                tmp.dataset.xy = element.x + element.y;

            getSeat( element.x, element.y ).appendChild( tmp );
        });

        alert( "Saved seats were successfully restored." );
    }
}


/* Remove all seats */
const clearAllSeat = saveBool => {
    for ( let item of document.querySelectorAll( ".seat" ) )
    {
        item.innerText = "";
    }

    if ( saveBool == null || saveBool ) save();
}


/* Load sample seat layout */
const loadSample = () =>
{
    if ( workspaceLoaded )
    {
        clearAllSeat();

        let andrew = generateSpan( "Andrew" );
            andrew.dataset.xy = "11";
        let robert = generateSpan( "Robert" );
            robert.dataset.xy = "12";
        let steve = generateSpan( "Steve" );
            steve.dataset.xy = "13";

        getSeat( 1, 1 ).appendChild( andrew );
        getSeat( 1, 2 ).appendChild( robert );
        getSeat( 1, 3 ).appendChild( steve );

        save();
    }
}


/* Get the selected seat DOM */
const getSeat = ( x, y ) => {
    return document.querySelector(`.seat[data-x="${x}"][data-y="${y}"]`);
}


/* Delete selected seat */
const deleteSelected = event => {
    event.target.classList.toggle( "active" );
    deleteMode = !deleteMode;
}


/* Make textarea editable or readonly */
const textareaDoubleClick = event => {
    console.log(event.target.readonly);
    if ( event.target.readOnly )
    {
        event.target.readOnly = false;
    }
    else
    {
        event.target.readOnly = true;
    }
}


/* Click to textarea - delete it */
const textAreaClick = event => {
    if ( deleteMode )
    {
        event.target.remove();
        save();
    }
}


/* Add new seat */
const addSeat = event => {
    if ( event.target.nodeName === "DIV" )
    {
        let newSeat = generateSpan( "New" );
            newSeat.dataset.xy = event.target.dataset.x + event.target.dataset.y;
        getSeat( event.target.dataset.x, event.target.dataset.y ).appendChild( newSeat );

        save();
    }
}


/* Generate draggable span element */
const generateSpan = name => {
    let span = document.createElement( "textarea" );
        span.classList.add( "seat-item" );
        span.draggable = "true";
    
    span.addEventListener( "dragstart", drag, false );
    span.addEventListener( "dblclick", textareaDoubleClick, false );
    span.addEventListener( "click", textAreaClick, false );
    span.value = name;

    return span;
}

/* Request fullscreen */
const goFullScreen = () => {
    document.getElementById("fullscreen-close").style.display = "block";
    workspace.requestFullscreen();
}

const closeFullScreen = () => {
    document.exitFullscreen();
}

document.addEventListener( "fullscreenchange", e => {
  //  document.getElementById("fullscreen-close").style.display = "none";
});


/* Allow element to drag and drop */
const allowDrop = event => {
    event.preventDefault();
}


/* Drag event handler */
const drag = event => {
    console.log(event);

    event.dataTransfer.setData( "seat", event.target.dataset.xy );
    event.dataTransfer.setData( "placeholderX", event.target.parentNode.dataset.x );
    event.dataTransfer.setData( "placeholderY", event.target.parentNode.dataset.y );
    //event.target.style.opacity = "0.5";
    //event.dataTransfer.effectAllowed = "copy";
}


/* Drop event handler */
const drop = event => {
    console.log(event);

    let seatData = event.dataTransfer.getData( "seat" );
    let seatItem = document.querySelector( '.seat-item[data-xy="'+seatData+'"]' );

    let placeholderXData = event.dataTransfer.getData( "placeholderX" );
    let placeholderYData = event.dataTransfer.getData( "placeholderY" );
    let oldPlaceholder = document.querySelector( '.seat[data-x="'+placeholderXData+'"][data-y="'+placeholderYData+'"]' );

    if ( event.target.nodeName === "DIV" )
    {
        event.target.appendChild( seatItem );
        seatItem.dataset.xy = event.target.dataset.x + event.target.dataset.y;
        event.target.dataset.empty = "0";
        oldPlaceholder.dataset.empty = "1";

        event.preventDefault();
    }
    else
    {
        let tmpItem = event.target;
        let newPlaceholder = event.target.parentNode;

        oldPlaceholder.appendChild( tmpItem );
        newPlaceholder.appendChild( seatItem );

        oldPlaceholder.dataset.empty = "0";
        newPlaceholder.dataset.empty = "0";

        seatItem.dataset.xy = newPlaceholder.dataset.x + newPlaceholder.dataset.y;
        tmpItem.dataset.xy = oldPlaceholder.dataset.x + oldPlaceholder.dataset.y;
        
        event.preventDefault();
    }
    //event.target.children[0].style.opacity = "1";

    save();
}


const exportSeats = () => {
    let text = "# VIP List\n";
    let counter = 1;

    for ( let item of document.querySelectorAll( '.seat' ) )
    {
        if ( item.childElementCount == 1 )
        {
            text += "- " + item.children[0].value + " " + counter + "\n";
            counter++;
        }
        else
        {
            text += "- \n";
        }
    }

    exportedTextarea.value = text;
}

const copyToClipboard = () => {
    exportSeats();
    navigator.clipboard.writeText(exportedTextarea.value);
}


/* Generate default seat placeholders */
let grid = document.getElementById( "sorting-grid" );
for ( let x = 1; x < 5; x++ )
{
    for ( let y = 1; y < 9; y++ )
    {
        let seat = document.createElement( "div" );
            seat.classList.add( "seat" );
            seat.classList.add( "draggable-seat" );
            seat.dataset.x = x;
            seat.dataset.y = y;
            seat.dataset.empty = 1;

        seat.addEventListener( "drop", drop, false );
        seat.addEventListener( "dragover", allowDrop, false );
        seat.addEventListener( "dblclick", addSeat, false );

        grid.appendChild( seat );
    }
}


/* Workspace generated, show workspace */
document.getElementById( "loading-workspace" ).style.display = "none";

workspace.style.display = "block";
workspaceLoaded = true;

load();