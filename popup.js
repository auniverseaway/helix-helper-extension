// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let changeColor = document.getElementById('clear-cache');

changeColor.onclick = function() {
  chrome.tabs.query({ active:true, currentWindow:true }, function(tab){
      console.log(tab[0].url);
  });
};