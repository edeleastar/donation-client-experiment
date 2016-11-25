define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './services/messages'], function (exports, _aureliaFramework, _aureliaEventAggregator, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function App(au, ea) {
      var _this = this;

      _classCallCheck(this, App);

      ea.subscribe(_messages.LoginStatus, function (msg) {
        if (msg.status.success === true) {
          au.setRoot('home').then(function () {
            _this.router.navigateToRoute('donate');
          });
        } else {
          au.setRoot('app').then(function () {
            _this.router.navigateToRoute('login');
          });
        }
      });
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: ['', 'login'], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' }, { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }]);
      this.router = router;
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('home',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia), _dec(_class = function () {
    function Home(au) {
      _classCallCheck(this, Home);

      this.aurelia = au;
    }

    Home.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: ['', 'home'], name: 'donate', moduleId: 'viewmodels/donate/donate', nav: true, title: 'Donate' }, { route: 'report', name: 'report', moduleId: 'viewmodels/report/report', nav: true, title: 'Report' }, { route: 'candidates', name: 'candidates', moduleId: 'viewmodels/candidates/candidates', nav: true, title: 'Candidates' }, { route: 'stats', name: 'stats', moduleId: 'viewmodels/stats/stats', nav: true, title: 'Stats' }, { route: 'dashboard', name: 'dashboard', moduleId: 'viewmodels/dashboard/dashboard', nav: true, title: 'Dashboard' }, { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }]);
      this.router = router;
    };

    return Home;
  }()) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/donation-service',['exports', 'aurelia-framework', './fixtures', './messages', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _fixtures, _messages, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _fixtures2 = _interopRequireDefault(_fixtures);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var DonationService = (_dec = (0, _aureliaFramework.inject)(_fixtures2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function DonationService(data, ea) {
      _classCallCheck(this, DonationService);

      this.donations = [];
      this.methods = [];
      this.candidates = [];
      this.users = [];
      this.total = 0;

      this.users = data.users;
      this.donations = data.donations;
      this.candidates = data.candidates;
      this.methods = data.methods;
      this.ea = ea;
    }

    DonationService.prototype.donate = function donate(amount, method, candidate) {
      var donation = {
        amount: amount,
        method: method,
        candidate: candidate
      };
      this.donations.push(donation);
      console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method);

      this.total = this.total + parseInt(amount, 10);
      console.log('Total so far ' + this.total);
      this.ea.publish(new _messages.TotalUpdate(this.total));
    };

    DonationService.prototype.addCandidate = function addCandidate(firstName, lastName, office) {
      var candidate = {
        firstName: firstName,
        lastName: lastName,
        office: office
      };
      this.candidates.push(candidate);
    };

    DonationService.prototype.register = function register(firstName, lastName, email, password) {
      var newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
      this.users[email] = newUser;
    };

    DonationService.prototype.login = function login(email, password) {
      var status = {
        success: false,
        message: ''
      };

      if (this.users[email]) {
        if (this.users[email].password === password) {
          status.success = true;
          status.message = 'logged in';
        } else {
          status.message = 'Incorrect password';
        }
      } else {
        status.message = 'Unknown user';
      }
      this.ea.publish(new _messages.LoginStatus(status));
    };

    DonationService.prototype.logout = function logout() {
      var status = {
        success: false,
        message: ''
      };
      this.ea.publish(new _messages.LoginStatus(new _messages.LoginStatus(status)));
    };

    return DonationService;
  }()) || _class);
  exports.default = DonationService;
});
define('services/fixtures',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Fixtures = function Fixtures() {
    _classCallCheck(this, Fixtures);

    this.methods = ['Cash', 'PayPal'];
    this.candidates = [{
      firstName: 'Lisa',
      lastName: 'Simpson'
    }, {
      firstName: 'Bart',
      lastName: 'Simpson'
    }];
    this.donations = [{
      amount: 23,
      method: 'cash',
      candidate: this.candidates[0]
    }, {
      amount: 212,
      method: 'paypal',
      candidate: this.candidates[1]
    }];
    this.users = {
      'homer@simpson.com': {
        firstName: 'Homer',
        lastName: 'Simpson',
        email: 'homer@simpson.com',
        password: 'secret'
      },
      'marge@simpson.com': {
        firstName: 'Marge',
        lastName: 'Simpson',
        email: 'marge@simpson.com',
        password: 'secret'
      }
    };
  };

  exports.default = Fixtures;
});
define('services/messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TotalUpdate = exports.TotalUpdate = function TotalUpdate(total) {
    _classCallCheck(this, TotalUpdate);

    this.total = total;
  };

  var LoginStatus = exports.LoginStatus = function LoginStatus(status) {
    _classCallCheck(this, LoginStatus);

    this.status = status;
  };
});
define('viewmodels/candidates/candidates',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Candidate = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Candidate = exports.Candidate = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Candidate(ds) {
      _classCallCheck(this, Candidate);

      this.firstName = '';
      this.lastName = '';
      this.office = '';

      this.donationService = ds;
    }

    Candidate.prototype.addCandidate = function addCandidate() {
      this.donationService.addCandidate(this.firstName, this.lastName, this.office);
    };

    return Candidate;
  }()) || _class);
});
define('viewmodels/dashboard/dashboard',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Dashboard = exports.Dashboard = function Dashboard() {
    _classCallCheck(this, Dashboard);
  };
});
define('viewmodels/donate/donate',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Donate = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Donate = exports.Donate = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Donate(ds) {
      _classCallCheck(this, Donate);

      this.amount = 0;
      this.methods = [];
      this.selectedMethod = '';
      this.candidates = [];
      this.selectedCandidate = '';

      this.donationService = ds;
      this.methods = ds.methods;
      this.selectedMethod = this.methods[0];
      this.candidates = ds.candidates;
      this.selectedCandidate = this.candidates[0];
    }

    Donate.prototype.makeDonation = function makeDonation() {
      this.donationService.donate(this.amount, this.selectedMethod, this.selectedCandidate);
    };

    return Donate;
  }()) || _class);
});
define('viewmodels/login/login',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Login(ds) {
      _classCallCheck(this, Login);

      this.email = 'marge@simpson.com';
      this.password = 'secret';

      this.donationService = ds;
      this.prompt = '';
    }

    Login.prototype.login = function login(e) {
      console.log('Trying to log in ' + this.email);
      this.donationService.login(this.email, this.password);
    };

    return Login;
  }()) || _class);
});
define('viewmodels/logout/logout',['exports', '../../services/donation-service', 'aurelia-framework'], function (exports, _donationService, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Logout(donationService) {
      _classCallCheck(this, Logout);

      this.donationService = donationService;
    }

    Logout.prototype.logout = function logout() {
      console.log('logging out');
      this.donationService.logout();
    };

    return Logout;
  }()) || _class);
});
define('viewmodels/report/report',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Report = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Report = exports.Report = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function Report(ds) {
    _classCallCheck(this, Report);

    this.donations = [];

    this.donationService = ds;
    this.donations = this.donationService.donations;
  }) || _class);
});
define('viewmodels/signup/signup',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Signup = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Signup(ds) {
      _classCallCheck(this, Signup);

      this.firstName = 'Marge';
      this.lastName = 'Simpson';
      this.email = 'marge@simpson.com';
      this.password = 'secret';

      this.donationService = ds;
    }

    Signup.prototype.register = function register(e) {
      this.showSignup = false;
      this.donationService.register(this.firstName, this.lastName, this.email, this.password);
      this.donationService.login(this.email, this.password);
    };

    return Signup;
  }()) || _class);
});
define('viewmodels/stats/stats',['exports', 'aurelia-framework', '../../services/messages', 'aurelia-event-aggregator', '../../services/donation-service'], function (exports, _aureliaFramework, _messages, _aureliaEventAggregator, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Stats = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Stats = exports.Stats = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator, _donationService2.default), _dec(_class = function () {
    function Stats(ea, ds) {
      var _this = this;

      _classCallCheck(this, Stats);

      this.total = 0;

      this.ds = ds;
      ea.subscribe(_messages.TotalUpdate, function (msg) {
        _this.total = msg.total;
      });
    }

    Stats.prototype.attached = function attached() {
      this.total = this.ds.total;
    };

    return Stats;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"ui inverted menu\">\n    <header class=\"header item\"><a href=\"/\"> Donation </a></header>\n    <div class=\"right menu\">\n      <div repeat.for=\"row of router.navigation\">\n        <a class=\"${row.isActive ? 'active' : ''} item\"  href.bind=\"row.href\">${row.title}</a>\n      </div>\n    </div>\n  </nav>\n</template>\n"; });
define('text!viewmodels/candidates/candidates.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.trigger=\"addCandidate()\" class=\"ui form stacked segment\">\n    <h3 class=\"ui dividing header\"> Add a Candidate </h3>\n    <div class=\"field\">\n      <label>First Name </label> <input value.bind=\"firstName\">\n    </div>\n    <div class=\"field\">\n      <label>Last Name </label> <input value.bind=\"lastName\">\n    </div>\n    <div class=\"field\">\n      <label>Office </label> <input value.bind=\"office\">\n    </div>\n    <button class=\"ui blue submit button\">Add</button>\n  </form>\n\n</template>"; });
define('text!viewmodels/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"ui grid segment\">\n    <div class=\"four wide column\">\n      <compose view-model=\"../donate/donate\"></compose>\n    </div>\n    <div class=\"four wide column\">\n      <compose class=\"four wide column\" view-model=\"../report/report\"></compose>\n    </div>\n    <div class=\"four wide column\">\n      <compose class=\"four wide column\" view-model=\"../candidates/candidates\"></compose>\n    </div>\n    <div class=\"four wide  column\">\n      <compose class=\"ui column\" view-model=\"../stats/stats\"></compose>\n    </div>\n  </section>\n</template>\n"; });
define('text!viewmodels/donate/donate.html', ['module'], function(module) { module.exports = "<template>\n\n    <form submit.trigger=\"makeDonation()\" class=\"ui form stacked segment\">\n\n      <h3 class='ui dividing header'> Make a Donation </h3>\n      <div class=\"grouped inline fields\">\n        <div class=\"field\">\n          <label>Amount</label> <input type=\"number\" value.bind=\"amount\">\n        </div>\n      </div>\n\n      <h4 class=\"ui dividing header\"> Select Method </h4>\n      <div class=\"grouped inline fields\">\n\n        <div class=\"field\" repeat.for=\"method of methods\">\n          <div class=\"ui radio checkbox\">\n            <input type=\"radio\" model.bind=\"method\" checked.bind=\"selectedMethod\">\n            <label>${method}</label>\n          </div>\n        </div>\n        <label class=\"ui circular label\"> ${selectedMethod} </label>\n      </div>\n\n      <h4 class=\"ui dividing header\"> Select Candidate </h4>\n      <div class=\"grouped inline fields\">\n        <div class=\"field\" repeat.for=\"candidate of candidates\">\n          <div class=\"ui radio checkbox\">\n            <input type=\"radio\" model.bind=\"candidate\" checked.bind=\"selectedCandidate\">\n            <label>${candidate.lastName}, ${candidate.firstName}</label>\n          </div>\n        </div>\n        <label class=\"ui circular label\"> ${selectedCandidate.firstName} ${selectedCandidate.lastName}</label>\n      </div>\n\n      <button class=\"ui blue submit button\">Donate</button>\n\n    </form>\n\n</template>"; });
define('text!viewmodels/login/login.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.delegate=\"login($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Log-in</h3>\n    <div class=\"field\">\n      <label>Email</label> <input placeholder=\"Email\" value.bind=\"email\"/>\n    </div>\n    <div class=\"field\">\n      <label>Password</label> <input type=\"password\" value.bind=\"password\"/>\n    </div>\n    <button class=\"ui blue submit button\">Login</button>\n    <h3>${prompt}</h3>\n  </form>\n\n</template>\n"; });
define('text!viewmodels/logout/logout.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.delegate=\"logout($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Are you sure you want to log out?</h3>\n    <button class=\"ui blue submit button\">Logout</button>\n  </form>\n\n</template>\n"; });
define('text!viewmodels/report/report.html', ['module'], function(module) { module.exports = "<template>\n\n  <article class=\"ui stacked segment\">\n    <h3 class='ui dividing header'> Donations to Date </h3>\n    <table class=\"ui celled table segment\">\n      <thead>\n        <tr>\n          <th>Amount</th>\n          <th>Method donated</th>\n          <th>Candidate</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr repeat.for=\"donation of donations\">\n          <td> ${donation.amount}</td>\n          <td> ${donation.method}</td>\n          <td> ${donation.candidate.lastName}, ${donation.candidate.firstName}</td>\n        </tr>\n      </tbody>\n    </table>\n  </article>\n\n</template>\n"; });
define('text!viewmodels/signup/signup.html', ['module'], function(module) { module.exports = "<template>\n  <form submit.delegate=\"register($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Register</h3>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>First Name</label>\n        <input placeholder=\"First Name\" type=\"text\" value.bind=\"firstName\">\n      </div>\n      <div class=\"field\">\n        <label>Last Name</label>\n        <input placeholder=\"Last Name\" type=\"text\" value.bind=\"lastName\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Email</label>\n      <input placeholder=\"Email\" type=\"text\" value.bind=\"email\">\n    </div>\n    <div class=\"field\">\n      <label>Password</label>\n      <input type=\"password\" value.bind=\"password\">\n    </div>\n    <button class=\"ui blue submit button\">Submit</button>\n  </form>\n</template>\n"; });
define('text!viewmodels/stats/stats.html', ['module'], function(module) { module.exports = "<template>\n\n  <section class=\"ui stacked statistic segment\">\n    <div class=\"value\">\n      ${total}\n    </div>\n    <div class=\"label\">\n      Donated\n    </div>\n  </section>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map