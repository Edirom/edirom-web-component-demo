/**
 * Represents the EdiromWebComponentDemo custom element.
 * @class
 * @extends HTMLElement
 */
class EdiromWebComponentDemo extends HTMLElement {

  /**
   * Creates an instance of EdiromWebComponentDemo.
   * @constructor
   */
  constructor() {
    super();

    /** attach shadow root with mode "open" */
    this.attachShadow({ mode: 'open' });

    // set default properties
    this.controlsAdded = false;

    // append content
    this.shadowRoot.innerHTML += `
      <style>
        h2 {
            font-size: 1em;
        }
        #web-component-container {
            height: 500px;
            width: 500px;
            border: 2px dashed #e0e0e0;
            resize: both;
            overflow: auto;
        }
        #wc-attribute-setters, #wc-custom-event-listeners {
            max-width: 90%;
        }
        .setter {
            display: inline-block;
            margin: 0 20px 20px 0;
        }
        
        .setter span {
            font-size: 0.9em;
            font-family: Arial;
            color: #333;
        }
        form {
            display: inline-block;
        }
      </style>

      <h2>Web Component Event Listeners</h2>
      <div id="wc-custom-event-listeners">
          <textarea rows="4" cols="50" readonly></textarea>
      </div>

      <h2>Web Component Attribute Setters</h2>
      <div id="wc-attribute-setters"></div>

      <hr/>
      
      <div id="web-component-container">
          
          <!-- PLACEHOLDER - embedded custom element -->
          <slot></slot>
         
      </div>

      `;

      // get slot element
      this.slotElement = this.shadowRoot.querySelector('slot');

      // add event listeners
      this.addEventListeners();

  }

  
  /**
   * Returns the list of observed attributes for the EdiromAudioPlayer custom element.
   * @static
   * @returns {Array<string>} The list of observed attributes.
   */
  static get observedAttributes() {
    return [ ];
  }


  /**
   * Invoked when the custom element is connected from the document's DOM.
   */
  connectedCallback() {

    if(!this.controlsAdded) {

      // now set controls added
      this.controlsAdded = true;

      // Listen for slot changes
      this.slotElement.addEventListener('slotchange', () => {

        const container = this.shadowRoot.querySelector('#web-component-container');
        const assignedElements = this.slotElement.assignedElements();

        // Access a specific custom element
        assignedElements.forEach(childComponent => {

          console.log("Child component found: ",childComponent);

          // get web component name
          const childComponentName = childComponent.tagName.toLowerCase();

          const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
            const {width, height} = entry.contentRect;
            childComponent.setAttribute('width', width+'px');
            childComponent.setAttribute('height', height+'px');
            }
          });

          resizeObserver.observe(container);
          

          // get HTML targets
          const textarea = this.shadowRoot.querySelector('#wc-custom-event-listeners textarea');
          const childComponentAttributeSetters = this.shadowRoot.querySelector('#wc-attribute-setters');
          childComponentAttributeSetters.innerHTML = '';

          
          // listen to event changes and provide setters for attributes of web component 
          childComponent.getAttributeNames().forEach(attribute => {

              // Adding event listeners for changes in the web component
              childComponent.addEventListener('communicate-'+attribute+'-update', (e) => {
                // attribute equals e.detail['property']
                textarea.textContent += 'Event "communicate-'+attribute+'-update" / '+e.detail['element']+' set '+e.detail['property']+'="'+e.detail['value']+'"\n';
                textarea.scrollTop = textarea.scrollHeight;
              });

              // Creating setters for the web component attribute values
              const setter = document.createElement('div');
              setter.setAttribute('class', 'setter');
              
              // setter label
              const setterSpan = document.createElement('span');
              setterSpan.textContent = attribute;
              setter.appendChild(setterSpan);

              // setter form
              const setterForm = document.createElement('form');
              
              const setterInput = document.createElement('input');
              setterInput.setAttribute('type', 'text');
              setterInput.setAttribute('name', attribute);
              setterInput.setAttribute('id', 'input-'+attribute);
              setterInput.setAttribute('value', childComponent.getAttribute(attribute));
              setterForm.appendChild(setterInput);

              const setterSubmit = document.createElement('input');
              setterSubmit.setAttribute('type', 'submit');
              setterSubmit.setAttribute('value', 'Set');
              setterForm.appendChild(setterSubmit);

              
              // setter event listener
              setterForm.addEventListener('submit', (e) => {
                  e.preventDefault();
                  childComponent.setAttribute(attribute, setterInput.value);
              });
              
              setter.appendChild(setterForm);

              childComponentAttributeSetters.appendChild(setter);

          });


        });
      });


    }

    

    // set event listeners again
    this.addEventListeners();

  }


  /**
   * Invoked when the custom element is disconnected from the document's DOM.
   */
  disconnectedCallback() { }


  /**
   * Invoked when the custom element is moved to a new document.
   */
  adoptedCallback() { }


  /**
   * Invoked when one of the custom element's attributes is added, removed, or changed.
   * @param {string} property - The name of the attribute that was changed.
   * @param {*} oldValue - The previous value of the attribute.
   * @param {*} newValue - The new value of the attribute.
   */
  attributeChangedCallback(property, oldValue, newValue) {

    // handle property change
    this.set(property, newValue);

  }


  /**
   * Sets the value of a global property and triggers property update events.
   * @param {string} property - The name of the property to set.
   * @param {*} newPropertyValue - The new value to set for the property.
   */
  set(property, newPropertyValue) {

    // set internal and html properties  
    this[property] = newPropertyValue;

    // custom event for property update
    const event = new CustomEvent('communicate-' + property + '-update', {
      detail: { [property]: newPropertyValue },
      bubbles: true
    });
    this.dispatchEvent(event);

    // further handling of property change
    this.handlePropertyChange(property, newPropertyValue);

  }


  /**
   * Handles property changes for the audio player.
   * @param {string} property - The name of the property being changed.
   * @param {any} newPropertyValue - The new value of the property.
   */
  handlePropertyChange(property, newPropertyValue) {
  
    // handle property change
    switch(property) {
      
      // handle track setting
      case '':

        break;

      // handle default
      default:  
        console.log("Invalid property: '"+property+"'");

    }

  }


  /**
   * Adds event listeners to various elements in the audio player component.
   * These event listeners handle play/pause button clicks, track toggler clicks,
   * audio player events (duration change, time update), progress slider input,
   * and playlist remove button clicks.
   */
  addEventListeners() {


  }
}

/** Define the custom element */
customElements.define('edirom-web-component-demo', EdiromWebComponentDemo);
