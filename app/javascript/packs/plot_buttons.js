import consumer from 'channels/consumer';
import ChartHelper from './chart_helper';

// This class:
//  - adds the callbacks to all the plot buttons,
//  - manages websocket connections
//  - manages the plots

// Remember to add the class in application.js (See examples)

// In order for this file to be used, the following data-attributes must
// be added to markup (see also the demos in app/views/plot_buttons/)

// In short:
//  - the plot element (where the graph will appear):
//    - should have class 'chart_area_canvas'
//    - should a have UNIQUE 'data-plot_id' attribute. This value should be
//      UNIQUE across the ENTIRE project
//  - the add buttons:
//    - should have class 'button-add-plot'
//    - should have a `data-project_id` attribute (this is the parameter for
//      the websocket connect)
//    - should have a 'data-plot_id' attribute, that matches with the
//      respective 'data-plot_id' attribute of the plot element
//  - the remove buttons:
//    - should have class 'button-remove-plot'
//    - should have a `data-project_id` attribute (this is the parameter for
//      the websocket connect)
//    - should have a 'data-plot_id' attribute, that matches with the
//      respective 'data-plot_id' attribute of the plot element
//  - the clear buttons:
//    - should have class 'clear-plot'
//    - should have a 'data-plot_id' attribute, that matches with the
//      respective 'data-plot_id' attribute of the plot element
export default class PlotButtons {
  // Constructor should be called in application.js (NOT in callback)
  constructor() {
    this.dataPointChannels = {};
    this.chartHelper = new ChartHelper();
  }

  // This method should be called in the "onload" callback at application.js, i.e.
  //  - If turbolinks is used, it is called from 'turbolinks:load' callback
  //  - If turbolinks is NOT used, but jquery IS, then '$(document).ready()' callback.
  //  - Otherwise 'DOMContentLoaded' callback
  initButtons() {
    this.chartHelper.initPlots();
    const addButtons = document.querySelectorAll('.button-add-plot');
    if (addButtons.length > 0) {
      addButtons.forEach((el) => {
        el.addEventListener('click', () => {
          this.chartHelper.addNewLine(el.dataset.plot_id, el.dataset.project_id);
          this.subscribeToProject(el.dataset.plot_id, el.dataset.project_id);
          el.parentElement.classList.add('added');

          return false;
        });
        if (
          this.dataPointChannels[el.dataset.plot_id]
          && this.dataPointChannels[el.dataset.plot_id][el.dataset.project_id]
        ) {
          el.parentElement.classList.add('added');
        }
      });
    }

    const removeButtons = document.querySelectorAll('.button-remove-plot');

    if (removeButtons.length > 0) {
      removeButtons.forEach((el) => {
        el.addEventListener('click', () => {
          this.removeSubscriptionFromPlot(
            el.dataset.plot_id,
            el.dataset.project_id,
          );
          el.parentElement.classList.remove('added');
          return false;
        });
      });
    }

    const clearButtons = document.querySelectorAll('.clear-plot');

    if (clearButtons.length > 0) {
      clearButtons.forEach((el) => {
        el.addEventListener('click', () => {
          Object.keys(this.dataPointChannels[el.dataset.plot_id]).forEach(
            (projectId) => {
              this.removeSubscriptionFromPlot(el.dataset.plot_id, projectId);
            },
          );
          this.chartHelper.clearPlot(el.dataset.plot_id);

          removeButtons.forEach((ell) => {
            if (ell.dataset.plot_id === el.dataset.plot_id) ell.parentElement.classList.remove('added');
          });
          return false;
        });
      });
    }
  }

  subscribeToProject(plotId, projectId) {
    this.dataPointChannels[plotId] ||= {};
    if (!this.dataPointChannels[plotId][projectId]) {
      this.dataPointChannels[plotId][projectId] = consumer.subscriptions.create(
        {
          channel: 'DataPointChannel',
          project_id: projectId,
        },
        {
          connected: () => {
            console.log('connected');
          },
          disconnected: () => {
            console.log('disconnected');
          },
          received: (data) => {
            console.log('received');
            console.log(data);

            this.chartHelper.addNewPoint(plotId, projectId, data);
          },
        },
      );
    }
  }

  removeSubscriptionFromPlot(plotId, projectId) {
    console.log('Removing ', plotId, projectId);
    if (
      this.dataPointChannels[plotId]
      && this.dataPointChannels[plotId][projectId]
    ) {
      consumer.subscriptions.remove(this.dataPointChannels[plotId][projectId]);
      delete this.dataPointChannels[plotId][projectId];
    }
    console.log(consumer.subscriptions);
  }
}
