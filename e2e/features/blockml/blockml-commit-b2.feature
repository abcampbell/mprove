Feature: blockml-commit-b2

  Scenario: blockml-commit-b2
    Given [common] scenario 'blockml-commit-b2'

    Then [common] I go to '/project/futurama/mode/dev/blockml'

    Then [common] I click field 'blockmlCommit' row '0'
    
    Then [common] I wait "1" seconds
    
    Then [common] I click 'blockmlTitle'
    
    Then [common] Field 'blockmlCommit' row '0' should be disabled

    Then [common] Field 'blockmlCommit' row '0' should be disabled
    Then [common] Field 'blockmlPushToProduction' row '0' should be enabled
    Then [common] Field 'blockmlOptions' row '0' should be enabled
