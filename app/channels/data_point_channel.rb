# frozen_string_literal: true

# app/channels/chat_channel.rb
class DataPointChannel < ApplicationCable::Channel
  # Called when the consumer has successfully
  # become a subscriber to this channel.
  def subscribed
    unless Rails.env.production?
      @thread ||= Thread.start do
        loop do
          ActionCable.server.broadcast("data_points_#{params[:project_id]}",
                                       ts: DateTime.now.to_s,
                                       val: rand(100))
          sleep(3)
        end
      end
    end

    stream_from("data_points_#{params[:project_id]}")
  end

  def unsubscribed
    # @thread.exit
  end
end
