# Because loading YAML locales is super-slow, only load english yml locale files in development
# To load all locales for testing, add "load_locales: true" to locals.yml config

if (CDO.skip_locales || Rails.env.development?) && (!CDO.load_locales)
  dev_locales = ["es-ES", "en"]
  suffixes = dev_locales.map { |x| "#{x}.yml" }
  locale_paths = Dashboard::Application.paths['config/locales'].expanded.select{|x| x.end_with?(*suffixes)}
  # Changed from railties_load_path for Rail5 compat.
  # Ref: https://github.com/rails/rails/issues/21228
  Dashboard::Application.config.i18n.load_path = locale_paths
end

# Preload translations (before application fork, after i18n_railtie initializer)
Dashboard::Application.config.after_initialize do |_|
  I18n.backend.init_translations if I18n.backend.respond_to? :init_translations
  I18n.t 'hello'
end

# Patch the I18n FileUpdateChecker to only load changed i18n files when updated.
Dashboard::Application.config.after_initialize do |app|
  app.reloaders.each do |reloader|
    if reloader.is_a?(ActiveSupport::FileUpdateChecker) && reloader.files == I18n.load_path
      reloader.block = lambda{|files| I18n.backend.load_translations(files)}
    end
  end
end

module UpdateCheckerExt
  # Expose @block and @files variables.
  attr_accessor :block, :files

  # Pass list of updated files as a block parameter.
  def execute
    @last_watched = watched
    @last_updated = @last_watched.reject{|path| File.mtime(path) < @last_update_at}
    @last_update_at = updated_at(@last_watched)
    @block.arity == 1 ? @block.call(@last_updated) : @block.call
  ensure
    @watched = nil
    @updated_at = nil
  end
end

ActiveSupport::FileUpdateChecker.prepend UpdateCheckerExt
