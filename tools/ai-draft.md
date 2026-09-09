
## 
Modify generate_mission_sql.py, add extra handling for "photo" and "video" type

for "photo" mission type, pick value from mission-data "Photo" column
and add parameter "image_url": "/assets/images/frames/1.png"

for "video" mission type, pick value from mission-data "Video" column
and add parameter "video_url": "/assets/videos/demo.mp4"

## 

Modify generate_mission_sql.py, add option --skip-start 
when the option exists, override the start_time using "2026-01-01 00:00:00"


### 

Modify generate_mission_sql.py with the change of the mission type 'quiz' logic

Modify the options object in parameter fields from 
```
"options": [
        {
          "label_zh": "愉快",
          "label_en": "Happy",
          "value": "a"
        },
        {
          "label_zh": "有點期待",
          "label_en": "Reassured",
          "value": "b"
        },
        {
          "label_zh": "平常",
          "label_en": "Slightly excited",
          "value": "c"
        }
      ],
```      
to 
```
"options": [
        {
          "label_zh": "愉快",
          "label_en": "Happy",
          "value": "a",
          "message_zh" : "......",
          "message_en" : "......",
        },
        {
          "label_zh": "有點期待",
          "label_en": "Reassured",
          "value": "b",
          "message_zh" : "......",
          "message_en" : "......",
        },
        {
          "label_zh": "平常",
          "label_en": "Slightly excited",
          "value": "c",
          "message_zh" : "......",
          "message_en" : "......",
        }
      ],
```
message_zh is come from the Result # (ZH) from quiz data depend the position of the choice 
message_en is come from the Result # (EN) from quiz data depend the position of the choice 


### 
Modify generate_mission_sql.py with the following rules:

add the cards data (read from soruce/cards.json) in to parameters when 
mission type = matching

### 

Modify generate_mission_sql.py with the following features:
- define the cover images based on the mission brand and the following mapping
    brand=MTR,MTR Mall cover_image=/assets/images/mission-cover/mtr.svg
    brand=牧羊少年 cover_image=/assets/images/mission-cover/thealchemistcafe.svg
    brand=誠品 cover_image=/assets/images/mission-cover/eslite.svg
    brand=Cafe330 cover_image=/assets/images/mission-cover/cafe330.svg
    brand=譚仔 cover_image=/assets/images/mission-cover/tamjai.svg
    brand=三哥 cover_image=/assets/images/mission-cover/samgor.svg

- add option 'debug_gps'     
    if the option is set, add "skip_gps": 1 in the parameters in all mission




### Initial 
Objective: Make a program to generate a mission sql 

Information:
- mission data file (330event-mission-data.csv) contain fields to convert to db data
- location data file (330event-location-data.csv) contain information of different location, it is used with "Mission Location Code" in mission data
- location quiz data (330event-quiz-data.csv) contain the question and answer for the quiz mission type 
- the mission contain the following Mission types:
    - photo, quiz, painting, audio, walking, reflection, letter, matching, AR, tamjai

Output: 
- Generate two output of the processed mission data
    - output/mission-data.json: a json list of the processed mission data 
    - output/mission-data.sql: a full sql for insert the mission data
- Also generate a error report log the error during the mission data construction 

Rules: 
首先我有33個任務, 幫我根據Location Code在地點的csv中mapping上去

最後到處的格式要為

INSERT INTO tbl_mission (id, slug, type, code, name_en, name_zh, description_en, description_zh, wellness_message_zh, wellness_message_en, address_zh, address_en, cover_image, start_time, end_time, category, location, parameter) VALUES
(1, 'handrail-temperature', 'reflection', 'T1', 'Handrail Temperature', '扶手溫度', '留意身邊物件的觸感或溫度，選擇您的感受。', '留意身邊物件的觸感或溫度，選擇您的感受。', '觸覺是最直接連結身體與當下的感官。透過留意物件的溫度與質感，可將注意力由思緒拉回身體，建立即時的存在感，並有助提升穩定與安定感。', '觸覺是最直接連結身體與當下的感官。透過留意物件的溫度與質感，可將注意力由思緒拉回身體，建立即時的存在感，並有助提升穩定與安定感。', '荔枝角、石硤尾、太子', '荔枝角、石硤尾、太子', '/assets/images/mission-cover/mtr.svg', '2026-02-09 11:53:50', '2027-01-16 00:00:00', 'mtr', '[\r\n {\r\n "brand": "MTR",\r\n "code": "skm",\r\n "name_zh": "石硤尾",\r\n "name_en": "Shek Kip Mei",\r\n "max_distance": 100,\r\n "lat": 22.33872102739848,\r\n "lng": 114.16829803731693,\r\n "x": 57.39,\r\n "y": 51.05\r\n },\r\n {\r\n "brand": "MTR",\r\n "code": "lck",\r\n "name_zh": "荔枝角",\r\n "name_en": "Lai Chi Kok",\r\n "max_distance": 100,\r\n "lat": 22.33942685498248,\r\n "lng": 114.15125597006113,\r\n "x": 53.23,\r\n "y": 51.66\r\n },\r\n {\r\n "brand": "MTR",\r\n "code": "ped",\r\n "name_zh": "太子",\r\n "name_en": "Prince Edward",\r\n "max_distance": 100,\r\n "lat": 22.324885921222652,\r\n "lng": 114.17246820001672,\r\n "x": 57.77,\r\n "y": 55.46\r\n }\r\n]\r\n', '{\r\n "skip_gps": 1,\r\n "message_zh": "您重新感受到身體。\n當下，其實一直都在您身邊。",\r\n "message_en": "You feel your body again.\nIt has actually been with you all along."\r\n}');

type = mission type
code = mission number
name_zh = Mission Name (Zh)
name_en = Mission Name (En)
description_zh = Mission Description (Zh)
description_en = Mission Description (En)
wellness_message_zh = Wellness Message (Zh)
wellness_message_en = Wellness Message (En)
address_zh = Mission Location (Zh)
address_en = Mission Location (En)
cover_image = NULL
start_time = Start Date
end_time = End Date

location = Mapped location data from the csv based on the Location Code
parameter = JSON string containing additional parameters for the mission. message_zh = Complete Mission Message, message_en = Complete Mission Message (En)

如果mission type是walking
parameter 裡面要包含
{
"required_distance": 30
}

如果mission type是quiz
parameter 裡面要包含
{
"question_zh": "您此刻感受到的人流節奏是？​",
"question_en": "What is the current crowd rhythm you are experiencing?",
"options": [
{
"label_zh": "快速",
"label_en": "Fast",
"value": "a",
"message_zh": "不​隨波​逐流。​急​中​求靜，​保持​清醒。",
"message_en": "Do not follow the crowd. Seek calm in the midst of urgency and stay clear-headed."
},
{
"label_zh": "平穩",
"label_en": "Stable",
"value": "b",
"message_zh": "融入​其中，​步調​一致，​省力​舒適。",
"message_en": "Blend in, keep a consistent pace, and stay comfortable with minimal effort."
},
{
"label_zh": "混合",
"label_en": "Mixed",
"value": "c",
"message_zh": "逆流​而行，​保持​清醒，​尋​找個​人​節奏。",
"message_en": "Go against the flow, stay clear-headed, and find your own rhythm."
},
{
"label_zh": "難以形容",
"label_en": "Indescribable",
"value": "d",
"message_zh": "隨​心​所欲，​不​被​拘束，​自在​前行。",
"message_en": "Follow your heart, be unrestrained, and move forward freely."
}
]
}

這些問題在quiz question csv 裡面找到

如果slug有重複,就在後面加上 -1, -2 以此類推
