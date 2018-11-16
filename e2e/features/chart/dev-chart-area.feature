Feature: dev-chart-area

  Scenario: dev-chart-area
    Given [common] scenario 'dev-chart-area'

    Then [common] I go to 'project/futurama/mode/dev/model/c_m3'

    Then [common] I click field 'modelTreeItemName' with text 'Name'

    Then [common] I wait "1" seconds
    
    Then [common] I click field 'modelTreeItemName' with text 'S_name'

    Then [common] I wait "1" seconds
    
    Then [common] I click field 'modelTreeItemName' with text 'Date'

    Then [common] I wait "1" seconds
    
    Then [common] I click field 'modelTreeItemName' with text 'S_value'

    Then [common] I wait "1" seconds
    
    Then [common] I click field 'modelQueryRun' row '0'    
    
    Then [common] I wait "3" seconds

    Then [common] I click field 'queryTabAddChart' row '0'     

    Then [common] I wait "1" seconds

    Then [common] I enter 'Area' into 'chartTitle' row '1'
    Then [common] I click field 'modelTitle' row '0'
    Then [common] Field 'chartTitle' row '1' attribute 'value' should be 'Area'        

    Then [common] I wait "1" seconds

    Then [common] I click field 'chartType' row '1'
    Then [common] I click field 'chartTypeArea' row '0'

    Then [common] I wait "1" seconds

    Then [common] I click field 'chartXField' row '1'
    Then [common] I click field 'chartXFieldOption' row '1'

    Then [common] I wait "1" seconds

    Then [common] I click field 'chartYFieldsCheckboxInner' row '5'

    Then [common] I wait "1" seconds

    Then [common] I click field 'chartMultiField' row '1'
    Then [common] I click field 'chartMultiFieldOption' row '0'

    Then [common] I wait "1" seconds

    Then [common] Flag 'chartShowXAxisLabelToggle' row '1' should be unchecked
    Then [common] I click field 'chartShowXAxisLabelToggleInner' row '1'
    Then [common] Flag 'chartShowXAxisLabelToggle' row '1' should be checked

    Then [common] I wait "1" seconds

    Then [common] I enter 'Census Date' into 'chartXAxisLabel' row '1'
    Then [common] I click field 'modelTitle' row '0'
    Then [common] Field 'chartXAxisLabel' row '1' attribute 'value' should be 'Census Date'   

    Then [common] I wait "1" seconds

    Then [common] Flag 'chartShowYAxisLabelToggle' row '1' should be unchecked
    Then [common] I click field 'chartShowYAxisLabelToggleInner' row '1'
    Then [common] Flag 'chartShowYAxisLabelToggle' row '1' should be checked

    Then [common] I wait "1" seconds    

    Then [common] I enter 'GDP Per Capita' into 'chartYAxisLabel' row '1'
    Then [common] I click field 'modelTitle' row '0'
    Then [common] Field 'chartYAxisLabel' row '1' attribute 'value' should be 'GDP Per Capita'     

    Then [common] I wait "1" seconds

    Then [common] Flag 'chartLegendToggle' row '1' should be unchecked
    Then [common] I click field 'chartLegendToggleInner' row '1'
    Then [common] Flag 'chartLegendToggle' row '1' should be checked      

    Then [common] I wait "1" seconds    

    Then [common] I enter '1000' into 'chartYScaleMin' row '1'
    Then [common] I click field 'modelTitle' row '0'
    Then [common] Field 'chartYScaleMin' row '1' attribute 'value' should be '1000'      

    Then [common] I wait "1" seconds    

    Then [common] I enter '10000' into 'chartYScaleMax' row '1'
    Then [common] I click field 'modelTitle' row '0'
    Then [common] Field 'chartYScaleMax' row '1' attribute 'value' should be '10000'      

    Then [common] I wait "1" seconds


    
    