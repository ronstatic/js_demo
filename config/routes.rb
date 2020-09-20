Rails.application.routes.draw do
  get 'plot_buttons/demo'
  get 'plot_buttons/second'
  get 'plot_buttons/third'
  get 'plot_buttons/no_plots'
  root to: 'plot_buttons#demo'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
