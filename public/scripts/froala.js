const editor = new FroalaEditor('#body', {
    toolbarButtons: {
        // Key represents the more button from the toolbar.
        moreText: {
            // List of buttons used in the  group.
            buttons: [
                'bold',
                'italic',
                'underline',
                'strikeThrough',
                'subscript',
                'superscript',
                'fontFamily',
                'fontSize',
                'textColor',
                'backgroundColor',
                'inlineClass',
                'inlineStyle',
                'clearFormatting',
            ],

            // Alignment of the group in the toolbar.
            align: 'left',

            // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
            buttonsVisible: 3,
        },

        moreParagraph: {
            buttons: [
                'alignLeft',
                'alignCenter',
                'paragraphFormat',
                'formatOLSimple',
                'alignRight',
                'alignJustify',
                'formatOL',
                'formatUL',
                'paragraphStyle',
                'lineHeight',
                'outdent',
                'indent',
                'quote',
            ],
            align: 'left',
            buttonsVisible: 3,
        },

        moreRich: {
            buttons: [
                'insertLink',
                'insertImage',
                'insertTable',
                'emoticons',
                'fontAwesome',
                'specialCharacters',
                'embedly',
                'insertHR',
            ],
            align: 'center',
            buttonsVisible: 2,
        },

        moreMisc: {
            buttons: ['undo', 'redo', 'fullscreen', 'spellChecker', 'selectAll', 'html', 'help'],
            align: 'right',
            buttonsVisible: 2,
        },
    },

    // Change buttons for XS screen.
    toolbarButtonsXS: [
        ['undo', 'redo'],
        ['bold', 'italic', 'underline'],
    ],
    height: 300,
    quickInsertEnabled: false,
    imageUploadURL: '/uploads/postimage',
    imageUploadParam: 'postimage',
    // Additional upload params.
    imageUploadParams: { id: 'my_editor' },

    // Set request type.
    imageUploadMethod: 'POST',

    // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    imageManagerPreloader: '/images/loader.gif',

    // imageManager
    imageManagerLoadURL: '/uploads/getimage',
});

