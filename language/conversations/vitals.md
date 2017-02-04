---
title: vitals
timestamp: 2017-02-04T14:43:52.777338472+05:30
---

< Welcome to Siya , your very own personal assistant.
* prompt/welcome_siya

< Please tell me your name.
* ask_user_detail/name

[swapnil](fname) [natu](lname)
* provide_name/patient_name

< Hi [swapnil](fname) ,congratulations on taking the first step towards a healthier future.  I will help you get there but I need some information from you first.
* prompt/need_some_information

< Please tell me your height
* ask_vitals/height

[5.5](number/height) [ft](unit)
* provide_vital/height

< And how much do you weight
* ask_vitals/weight

[75](number/weight) [kg](unit)
* provide_vital/weight

[swapnil](fname), Your BMI is [27](bmi) [which is higher than the normal BMI. Ideally you should weigh around 65 kg. But do not panic , I will help you get there slowly and steadily.](bmi_msg)
* provide_vital/bmi_result
