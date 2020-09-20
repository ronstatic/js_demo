# frozen_string_literal: true

### This controller initializes the variables for displaying the plots
class PlotButtonsController < ApplicationController
  def demo
    @projects = 1.upto(10).map do |i|
      {
        name: "Project_#{i}",
        project_id: i
      }
    end
    ## Warning plot_id value should be unique for the entire app
    @plot_id = 'first_chart'
  end

  def second
    @projects = 11.upto(20).map do |i|
      {
        name: "Project_#{i}",
        project_id: i
      }
    end
    ## Warning plot_id value should be unique for the entire app
    @plot_id = 'second_chart'
  end

  def third
    @projects = 1.upto(5).map do |i|
      {
        name: "Project_#{i}",
        project_id: i,
        ## Warning plot_id value should be unique for the entire app
        plot_id: "individual_chart_#{i}"
      }
    end
  end

  def no_plots; end
end
