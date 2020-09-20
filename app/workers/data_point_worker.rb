# frozen_string_literal: true

# This worker broeadcasts events to send to the the websockets
class DataPointWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform
    loop do
      1.upto(20) do |project_id|
        ActionCable.server.broadcast("data_points_#{project_id}",
                                     ts: DateTime.now.to_s,
                                     val: rand(100))
      end
      sleep(3)
    end
  end
end
