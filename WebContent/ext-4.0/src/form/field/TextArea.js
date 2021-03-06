/**
 * @class Ext.form.field.TextArea
 * @extends Ext.form.field.Text

This class creates a multiline text field, which can be used as a direct replacement for traditional 
textarea fields. In addition, it supports automatically {@link #grow growing} the height of the textarea to 
fit its content.

All of the configuration options from {@link Ext.form.field.Text} can be used on TextArea.
{@img Ext.form.TextArea/Ext.form.TextArea.png Ext.form.TextArea component}
Example usage:

    Ext.create('Ext.form.FormPanel', {
        title      : 'Sample TextArea',
        width      : 400,
        bodyPadding: 10,
        renderTo   : Ext.getBody(),
        items: [{
            xtype     : 'textareafield',
            grow      : true,
            name      : 'message',
            fieldLabel: 'Message',
            anchor    : '100%'
        }]
    }); 

Some other useful configuration options when using {@link #grow} are {@link #growMin} and {@link #growMax}. These 
allow you to set the minimum and maximum grow heights for the textarea.

 * @constructor
 * Creates a new TextArea
 * @param {Object} config Configuration options
 * @xtype textareafield
 * @docauthor Robert Dougan <rob@sencha.com>
 */
Ext.define('Ext.form.field.TextArea', {
    extend:'Ext.form.field.Text',
    alias: ['widget.textareafield', 'widget.textarea'],
    alternateClassName: 'Ext.form.TextArea',
    requires: ['Ext.XTemplate', 'Ext.layout.component.field.TextArea'],

    fieldSubTpl: [
        '<textarea id="{id}" ',
            '<tpl if="name">name="{name}" </tpl>',
            '<tpl if="rows">rows="{rows}" </tpl>',
            '<tpl if="cols">cols="{cols}" </tpl>',
            '<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
            'class="{fieldCls} {typeCls}" ',
            'autocomplete="off">',
        '</textarea>',
        {
            compiled: true,
            disableFormats: true
        }
    ],

    /**
     * @cfg {Number} growMin The minimum height to allow when <tt>{@link Ext.form.field.Text#grow grow}=true</tt>
     * (defaults to <tt>60</tt>)
     */
    growMin: 60,

    /**
     * @cfg {Number} growMax The maximum height to allow when <tt>{@link Ext.form.field.Text#grow grow}=true</tt>
     * (defaults to <tt>1000</tt>)
     */
    growMax: 1000,

    /**
     * @cfg {String} growAppend
     * A string that will be appended to the field's current value for the purposes of calculating the target
     * field size. Only used when the {@link #grow} config is <tt>true</tt>. Defaults to a newline for TextArea
     * to ensure there is always a space below the current line.
     */
    growAppend: '\n-',

    /**
     * @cfg {Number} cols An initial value for the 'cols' attribute on the textarea element. This is only
     * used if the component has no configured {@link #width} and is not given a width by its container's
     * layout. Defaults to <tt>20</tt>.
     */
    cols: 20,

    /**
     * @cfg {Number} cols An initial value for the 'cols' attribute on the textarea element. This is only
     * used if the component has no configured {@link #width} and is not given a width by its container's
     * layout. Defaults to <tt>4</tt>.
     */
    rows: 4,

    /**
     * @cfg {Boolean} enterIsSpecial
     * True if you want the enter key to be classed as a <tt>special</tt> key. Special keys are generally navigation
     * keys (arrows, space, enter). Setting the config property to <tt>true</tt> would mean that you could not insert
     * returns into the textarea.
     * (defaults to <tt>false</tt>)
     */
    enterIsSpecial: false,

    /**
     * @cfg {Boolean} preventScrollbars <tt>true</tt> to prevent scrollbars from appearing regardless of how much text is
     * in the field. This option is only relevant when {@link #grow} is <tt>true</tt>. Equivalent to setting overflow: hidden, defaults to
     * <tt>false</tt>.
     */
    preventScrollbars: false,

    // private
    componentLayout: 'textareafield',

    // private
    onRender: function(ct, position) {
        var me = this;
        Ext.applyIf(me.subTplData, {
            cols: me.cols,
            rows: me.rows
        });

        me.callParent(arguments);
    },

    // private
    afterRender: function(){
        var me = this;

        me.callParent(arguments);

        if (me.grow) {
            if (me.preventScrollbars) {
                me.inputEl.setStyle('overflow', 'hidden');
            }
            me.inputEl.setHeight(me.growMin);
        }
    },

    // private
    fireKey: function(e) {
        if (e.isSpecialKey() && (this.enterIsSpecial || (e.getKey() !== e.ENTER || e.hasModifier()))) {
            this.fireEvent('specialkey', this, e);
        }
    },

    /**
     * Automatically grows the field to accomodate the height of the text up to the maximum field height allowed.
     * This only takes effect if <tt>{@link #grow} = true</tt>, and fires the {@link #autosize} event if
     * the height changes.
     */
    autoSize: function() {
        var me = this,
            height;

        if (me.grow && me.rendered) {
            me.doComponentLayout();
            height = me.inputEl.getHeight();
            if (height !== me.lastInputHeight) {
                me.fireEvent('autosize', height);
                me.lastInputHeight = height;
            }
        }
    },

    // private
    initAria: function() {
        this.callParent(arguments);
        this.getActionEl().dom.setAttribute('aria-multiline', true);
    },

    /**
     * @protected override
     * To get the natural width of the textarea element, we do a simple calculation based on the
     * 'cols' config. We use hard-coded numbers to approximate what browsers do natively,
     * to avoid having to read any styles which would hurt performance.
     */
    getBodyNaturalWidth: function() {
        return Math.round(this.cols * 6.5) + 20;
    }

});

