/**
 * Constant variables
 * for the functions' working
 */
var workspaceLoaded = false;
var workspace = document.getElementById( "workspace" );


/* Link handler function */
for ( let link of document.getElementsByClassName( "scroll-link" ) )
{
    link.addEventListener( "click", () => {
        window.location.href = link.dataset.link;
    })
}

/* Remove all seats */
const clearAllSeat = () => {
    for ( let item of document.querySelectorAll( ".seat" ) )
    {
        item.innerText = "";
    }
}


/* Load sample */
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
    }
}

/* Get the selected seat DOM */
const getSeat = ( x, y ) => {
    return document.querySelector(`.seat[data-x="${x}"][data-y="${y}"]`);
}

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


/* Generate draggable span element */
const generateSpan = name => {
    let span = document.createElement( "textarea" );
        span.classList.add( "seat-item" );
        span.draggable = "true";
    
    span.addEventListener( "dragstart", drag, false );
    span.addEventListener( "dblclick", textareaDoubleClick, false );
    span.value = name;

    return span;
}

/* Request fullscreen */
const goFullScreen = () => {
    let doc = document.getElementById( "sorting-grid" );
    doc.requestFullscreen();
}



/* Drag and drop event handlers */
const allowDrop = event => {
    event.preventDefault();
}

const drag = event => {
    console.log(event);

    event.dataTransfer.setData( "seat", event.target.dataset.xy );
    event.dataTransfer.setData( "placeholderX", event.target.parentNode.dataset.x );
    event.dataTransfer.setData( "placeholderY", event.target.parentNode.dataset.y );
    //event.target.style.opacity = "0.5";
    //event.dataTransfer.effectAllowed = "copy";
}

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
}


/* Generate default seats */
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

        grid.appendChild( seat );
    }
}


/* Workspace generated, show workspace */
document.getElementById( "loading-workspace" ).style.display = "none";

workspace.style.display = "block";
workspaceLoaded = true;