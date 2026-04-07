import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Text "mo:core/Text";

actor {
  // Types
  public type UserProfile = {
    fullName : Text;
    email : Text;
    mobile : Text;
  };

  public type Profile = {
    fullName : Text;
    email : Text;
    mobile : Text;
    password : Text;
  };

  public type Exam = {
    id : Nat;
    title : Text;
    category : Text;
    examDate : Text;
  };

  public type ExamRegistration = {
    user : Principal;
    examId : Nat;
    timestamp : Time.Time;
  };

  // State
  let profiles = Map.empty<Principal, Profile>();
  let registrations = Map.empty<Principal, Map.Map<Nat, ExamRegistration>>();

  // Exam catalog — initialized with all 21 courses on first deployment
  var examCatalog : [Exam] = [
    { id = 1;  title = "Python for Data Science";                  category = "Professional & Technology";       examDate = "15 Jun 2026" },
    { id = 2;  title = "Introduction to Machine Learning";         category = "Professional & Technology";       examDate = "20 Jun 2026" },
    { id = 3;  title = "Ethical Hacking";                          category = "Professional & Technology";       examDate = "25 Jun 2026" },
    { id = 4;  title = "Data Structures and Algorithms";           category = "Professional & Technology";       examDate = "30 Jun 2026" },
    { id = 5;  title = "Android Mobile Application Development";   category = "Professional & Technology";       examDate = "5 Jul 2026"  },
    { id = 6;  title = "Advanced C++";                             category = "Professional & Technology";       examDate = "10 Jul 2026" },
    { id = 7;  title = "Financial Accounting and Analysis";        category = "Management & Commerce";           examDate = "15 Jul 2026" },
    { id = 8;  title = "Supply Chain Management";                  category = "Management & Commerce";           examDate = "20 Jul 2026" },
    { id = 9;  title = "Digital Marketing";                        category = "Management & Commerce";           examDate = "25 Jul 2026" },
    { id = 10; title = "Direct Tax - Laws and Practice";           category = "Management & Commerce";           examDate = "30 Jul 2026" },
    { id = 11; title = "Organisation Behaviour";                   category = "Management & Commerce";           examDate = "5 Aug 2026"  },
    { id = 12; title = "Academic Writing";                         category = "Humanities, Arts & Education";    examDate = "10 Aug 2026" },
    { id = 13; title = "Animation";                                category = "Humanities, Arts & Education";    examDate = "15 Aug 2026" },
    { id = 14; title = "Society and Media";                        category = "Humanities, Arts & Education";    examDate = "20 Aug 2026" },
    { id = 15; title = "Introduction to Cyber Security";           category = "Humanities, Arts & Education";    examDate = "25 Aug 2026" },
    { id = 16; title = "Early Childhood Care and Education";       category = "Humanities, Arts & Education";    examDate = "30 Aug 2026" },
    { id = 17; title = "AI Engineer";                              category = "SWAYAM Plus";                     examDate = "5 Sep 2026"  },
    { id = 18; title = "Applied Database System Engineering";      category = "SWAYAM Plus";                     examDate = "10 Sep 2026" },
    { id = 19; title = "3D Printing and Design";                   category = "SWAYAM Plus";                     examDate = "15 Sep 2026" },
    { id = 20; title = "Soft Skills and Employability";            category = "SWAYAM Plus";                     examDate = "20 Sep 2026" },
    { id = 21; title = "Science of Yoga";                          category = "SWAYAM Plus";                     examDate = "25 Sep 2026" },
  ];

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  system func preupgrade() {};
  system func postupgrade() {};

  // Helper: require caller to have a registered profile
  func requireRegistered(caller : Principal) {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Please register first.") };
      case (?_) {};
    };
  };

  // Profile queries
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    requireRegistered(caller);
    switch (profiles.get(caller)) {
      case (null) { null };
      case (?profile) {
        ?{
          fullName = profile.fullName;
          email = profile.email;
          mobile = profile.mobile;
        }
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (profiles.get(user)) {
      case (null) { null };
      case (?profile) {
        ?{
          fullName = profile.fullName;
          email = profile.email;
          mobile = profile.mobile;
        }
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(userProfile : UserProfile) : async () {
    requireRegistered(caller);
    switch (profiles.get(caller)) {
      case (null) {
        Runtime.trap("User not found. Please register first.");
      };
      case (?existingProfile) {
        let updatedProfile : Profile = {
          fullName = userProfile.fullName;
          email = userProfile.email;
          mobile = userProfile.mobile;
          password = existingProfile.password;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  // User Management
  public shared ({ caller }) func register(fullName : Text, email : Text, mobile : Text, password : Text) : async () {
    for ((_, profile) in profiles.entries()) {
      if (profile.email == email) {
        Runtime.trap("Email already exists. Please login instead.");
      };
    };

    let profile : Profile = { fullName; email; mobile; password };
    profiles.add(caller, profile);
    accessControlState.userRoles.add(caller, #user);
  };

  public shared func login(email : Text, password : Text) : async Profile {
    var foundProfile : ?Profile = null;

    for ((_, profile) in profiles.entries()) {
      if (profile.email == email) {
        foundProfile := ?profile;
      };
    };

    switch (foundProfile) {
      case (null) {
        Runtime.trap("Email does not exist. Please register first.")
      };
      case (?profile) {
        if (profile.password != password) {
          Runtime.trap("Incorrect password. Please try again.");
        };
        profile;
      };
    };
  };

  public query ({ caller }) func getMyProfile() : async Profile {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("User not found. Please register first.") };
      case (?profile) { profile };
    };
  };

  // Exam Catalog
  public query func getAllExams() : async [Exam] {
    examCatalog
  };

  public query func getExamsByCategory(category : Text) : async [Exam] {
    examCatalog.filter(func(e : Exam) : Bool { e.category == category })
  };

  // Exam Registration
  public shared ({ caller }) func registerForExam(examId : Nat) : async () {
    requireRegistered(caller);

    var examExists = false;
    for (e in examCatalog.vals()) {
      if (e.id == examId) { examExists := true };
    };
    if (not examExists) {
      Runtime.trap("Exam not found.");
    };

    let userRegistrations = switch (registrations.get(caller)) {
      case (null) { Map.empty<Nat, ExamRegistration>() };
      case (?regs) { regs };
    };

    if (userRegistrations.containsKey(examId)) {
      Runtime.trap("You are already registered for this exam.");
    };

    let registration : ExamRegistration = {
      user = caller;
      examId;
      timestamp = Time.now();
    };

    userRegistrations.add(examId, registration);
    registrations.add(caller, userRegistrations);
  };

  public query ({ caller }) func getMyRegistrations() : async [ExamRegistration] {
    switch (registrations.get(caller)) {
      case (null) { [] };
      case (?regs) { regs.values().toArray() };
    };
  };

  public shared ({ caller }) func unregisterFromExam(examId : Nat) : async () {
    requireRegistered(caller);

    switch (registrations.get(caller)) {
      case (null) { Runtime.trap("You have no registrations.") };
      case (?userRegistrations) {
        if (not userRegistrations.containsKey(examId)) {
          Runtime.trap("You are not registered for this exam.");
        };
        userRegistrations.remove(examId);
        registrations.add(caller, userRegistrations);
      };
    };
  };
};
