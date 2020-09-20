# frozen_string_literal: true

Redis.exists_returns_integer = false

Sidekiq.configure_server do |config|
  config.redis = {
    url: 'redis://localhost:6379/6'
  }
  config.on(:startup) do
    Rails.logger.debug 'ON STARTUP CODE'
    workers = Sidekiq::Workers.new
    Rails.logger.debug "The scheduledSet is #{workers .inspect}"
    data_point_workers = workers.select do |_process_id, _thread_id, work|
      work['payload']['class'] == 'DataPointWorker'
    end

    in_queue = Sidekiq::Queue.new.select do |job|
      job.klass == 'DataPointWorker'
    end

    scheduled = Sidekiq::ScheduledSet.new.select do |job|
      job.klass == 'DataPointWorker'
    end

    Rails.logger.debug "We have #{scheduled.count} scheduled," \
      "#{in_queue.count} in queue, and #{data_point_workers.count} workers."

    already_scheduled = scheduled.count + in_queue.count +
                        data_point_workers.count
    DataPointWorker.perform_async if already_scheduled.zero?
  end
end

Sidekiq.configure_client do |config|
  config.redis = {
    url: 'redis://localhost:6379/6'
  }
end
