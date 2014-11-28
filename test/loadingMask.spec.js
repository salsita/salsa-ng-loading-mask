describe('LoadingMask', function () {
  describe('LoadingMask configuration aware', function() {

    it('is able to configure custom template via directive attribute', function() {
      var $compile,
          $rootScope;

      module('salsaNgLoadingMask', function(_SalsaLoadingMaskConfigProvider_) {
        _SalsaLoadingMaskConfigProvider_.set({
          template: '<div class="bar">{{context.content}}</div>'
        });
      });

      inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
      });

      var directive = $compile('<div salsa-loading-mask salsa-loading-mask-template-data="{content:\'foo\'}"></div>')($rootScope);
      $rootScope.$digest();

      expect(directive.find('.bar').length).not.toEqual(0);
      expect(directive.find('.bar').text()).toEqual('foo');
    });
  });

  describe('LoadingMask configuration not aware', function() {
    var $compile,
        $httpBackend,
        $http,
        $rootScope,
        salsaScope;

    beforeEach(module('salsaNgLoadingMask'));
    beforeEach(inject(function(_$compile_, _$httpBackend_, _$http_, _$rootScope_, _SalsaLoadingMaskScope_) {
      $compile = _$compile_;
      $http = _$http_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      salsaScope = _SalsaLoadingMaskScope_;
    }));
    beforeEach(function() {
      $httpBackend.whenGET(/\/dummy/).respond(200, {});
      $httpBackend.whenGET(/\/error/).respond(500, {});
      $httpBackend.whenGET(/\/notFound/).respond(404, {});
    });

    it('is able to create salsa-loading-mask-directive', function() {
      var directive = $compile('<div salsa-loading-mask></div>')($rootScope);

      expect(directive.find('.salsa-mask').length).toEqual(1);
    });

    it('is able to mask for default group', function() {
      var directive = $compile('<div salsa-loading-mask></div>')($rootScope);

      $http.get('/dummy', {loadingMask: true});
      $rootScope.$digest();

      expect(directive.find('.salsa-mask').hasClass('shown')).toBeTruthy();

      $httpBackend.flush();
      expect(directive.find('.salsa-mask').hasClass('shown')).toBeFalsy();
    });

    it('is able to mask for an error request', function() {
      var directive = $compile('<div salsa-loading-mask></div>')($rootScope);

      $http.get('/error', {loadingMask: true});
      $rootScope.$digest();

      expect(directive.find('.salsa-mask').hasClass('shown')).toBeTruthy();

      $httpBackend.flush();
      expect(directive.find('.salsa-mask').hasClass('shown')).toBeFalsy();
    });

    it('is able to add some class after error request', function() {
      var directive = $compile('<div salsa-loading-mask></div>')($rootScope);

      $http.get('/error', {loadingMask: true});
      $rootScope.$digest();

      expect(directive.find('.salsa-mask').hasClass('shown')).toBeTruthy();

      $httpBackend.flush();
      expect(directive.find('.salsa-mask').hasClass('error')).toBeTruthy();

      $http.get('/dummy', {loadingMask: true});
      $rootScope.$digest();
      expect(directive.find('.salsa-mask').hasClass('error')).toBeFalsy();
    });

    it('is able to mask for a not found request', function() {
      var directive = $compile('<div salsa-loading-mask></div>')($rootScope);

      $http.get('/notFound', {loadingMask: true});
      $rootScope.$digest();

      expect(directive.find('.salsa-mask').hasClass('shown')).toBeTruthy();

      $httpBackend.flush();
      expect(directive.find('.salsa-mask').hasClass('shown')).toBeFalsy();
    });

    it('is able to mask full screen', function() {
      var directive = $compile('<div salsa-loading-mask salsa-loading-mask-fullscreen></div>')($rootScope);

      $http.get('/dummy', {loadingMask: true});
      $rootScope.$digest();

      expect(directive.find('.salsa-mask').css('left')).toEqual('0px');
      expect(directive.find('.salsa-mask').css('right')).toEqual('0px');
      expect(directive.find('.salsa-mask').css('top')).toEqual('0px');
      expect(directive.find('.salsa-mask').css('bottom')).toEqual('0px');
      expect(directive.find('.salsa-mask').css('position')).toEqual('fixed');
    });

    it('is able to transclude content of the template', function() {
      var directive = $compile('<div salsa-loading-mask></div>')($rootScope);
      expect(directive.find('ng-transclude').length).not.toEqual(0);
    });

    it('is able to use multiple groups for masking', function() {
      var group1Directive = $compile('<div salsa-loading-mask salsa-loading-mask-group="group1"></div>')($rootScope),
          group2Directive = $compile('<div salsa-loading-mask salsa-loading-mask-group="group2"></div>')($rootScope);

      $http.get('/dummy', {loadingMask: 'group1'});
      $rootScope.$digest();

      expect(group1Directive.find('.salsa-mask').hasClass('shown')).toBeTruthy();
      expect(group2Directive.find('.salsa-mask').hasClass('shown')).toBeFalsy();

      $http.get('/dummy', {loadingMask: 'group2'});
      $rootScope.$digest();

      expect(group1Directive.find('.salsa-mask').hasClass('shown')).toBeTruthy();
      expect(group2Directive.find('.salsa-mask').hasClass('shown')).toBeTruthy();

      $httpBackend.flush();

      expect(group1Directive.find('.salsa-mask').hasClass('shown')).toBeFalsy();
      expect(group2Directive.find('.salsa-mask').hasClass('shown')).toBeFalsy();
    });
  });
});