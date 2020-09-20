# frozen_string_literal: true

require 'test_helper'

class PlotButtonsControllerTest < ActionDispatch::IntegrationTest
  test 'should get demo' do
    get plot_buttons_second_url
    assert_response :success
  end

  test 'should get second' do
    get plot_buttons_second_url
    assert_response :success
  end

  test 'should get third' do
    get plot_buttons_third_url
    assert_response :success
  end

  test 'should get no_plots' do
    get plot_buttons_no_plots_url
    assert_response :success
  end

end
