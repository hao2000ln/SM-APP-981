

function FactoryBase( appName )
{
}

FactoryBase.prototype.createApp = function createApp()
{
  return new lib.app.AppBase();
}

FactoryBase.prototype.createLogger = function createLogger()
{
  return new lib.executor.Logger();
}

FactoryBase.prototype.createAppLoader = function createAppLoader()
{
  return new AppLoaderBase();
}

FactoryBase.prototype.createEntity = function createEntity()
{
  return new lib.entity.EntityBase();
}


function AppLoaderBase()
{
}

AppLoaderBase.prototype.LoadApp = function LoadApp( appName, factory )
{
  var app = factory.createApp();
  var entity = factory.createEntity();
  var logger = factory.createLogger();
  app._entity = entity;
  app.logger = logger;
  app._factory = factory;
  app._appName = appName;

  return app;
}



