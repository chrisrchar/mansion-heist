var events = [];

var eventsDone = [];

for (var i=0; i<events.length; i++)
{
    eventsDone[i] = false;
}

function setEvents () {
    
    console.log('setting events');
    console.log(textPlacement['default'].x);

    events[0] = [
        {
            text: "*bzzz* *bzzz* Hey, Boss. Can you hear me? It's Crow, your eyes in the sky!",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "Good job breaking into the mansion. We'll have your treasure back from that Weaselman scum in no time!",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "For now, make your way through the library and into the main part of the house.",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "In case you forgot, you can use the "+textForMove+" to move around and the "+textForJump+" to jump up to out of reach places.",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "If you see anything dangerous or something you just want to smash, whack it with your cane using the "+textForAtk+".",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "I'll check back in with you in a bit. *bzzz* *bzzz*",
            font: "pearsoda",
            placement: 'default',
            size: 40
        }
    ];
    
    events[1] = [
        {
            text: "*bzzz* *bzzz* Hey, Boss. What did you just do? Why did you just drink that?",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "That was just sitting there. Who knows where it's been! Do you think you're going to get some special powers or something by drinking it?",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "Don't be stupid. *bzzz* *bzzz*",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "You can now Double Jump!",
            font: "cartwheel",
            placement: 'center',
            size: 40
        },
        {
            text: "Jump again while in the air for some extra height.",
            font: "cartwheel",
            placement: 'center',
            size: 32
        },
    ];
    
    events[2] = [
        {
            text: "*bzzz* *bzzz* Hey, Boss. This Restroom looks like it might be a good place to take a break.",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "You won't have to worry about anyone finding you in here, ya know, since they have to knock first. *bzzz* *bzzz*",
            font: "pearsoda",
            placement: 'default',
            size: 40
        }
    ];
    
    events[3] = [
        {
            text: "*bzzz* *bzzz* Hey, Boss. STOP drinking from random cups that are just sitting around. What if they're poisoned?",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "You got lucky last time, but continuing to do this is dangerous. There's just NO benefit to doing something so stupid. *bzzz* *bzzz*",
            font: "pearsoda",
            placement: 'default',
            size: 40
        },
        {
            text: "You can now turn Invisible!",
            font: "cartwheel",
            placement: 'center',
            size: 40
        },
        {
            text: "Hold down the "+textForAbl+" in order to turn invisible and walk through lasers.\nGuards will still see you and hurt you if you run into them, though.",
            font: "cartwheel",
            placement: 'center',
            size: 24
        }
    ];
}