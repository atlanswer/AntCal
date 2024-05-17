%--------------------------------------------------------------------------
%                                dRec_en.m                                   
%--------------------------------------------------------------------------
%  Rectangular dielectric resonator design (english)                                              
%
%    A) INPUTS
%
%    1. 'freq' = Desired resonant frequency                        
%    2. 'mode_choice' = Desired mode of radiation             
%    3. 'BW' = Desired minimum impedance bandwidth         
%    4. 'VSWR' = Tolerable Voltage standing wave ratio for the calculations    
%    5. 'er' = Dielectric constant of the available material
%    6. 'ratio' = 'Width/height' ratio of the resonator (facultative)
%    7. 'ratio2' = 'Depth/height' ratio of the resonator (facultative)
%
%    B) OUTPUTS
%
%    - The dimensions (width, depth, and height) of the resonator for which 
%      the minimum bandwidth is respected at the resonant frequency. If the 
%      'width/height' and/or 'depth/height' ratio(s) is (are) not specified 
%      by the user, a list of all the possible dimensions respecting the 
%      design criterions will be generated (over user-defined span(s) of 
%      ratios).
%--------------------------------------------------------------------------
%  Reference:
%
%  - R.K. Mongia and A. Ittipiboon, "Theoretical and experimental
%    investigations on rectangular dielectric resonator antennas," IEEE
%    Transactions on antennas and propagation, Vol. 45, No. 9, September
%    1997, pp. 1348-1356.
%--------------------------------------------------------------------------
%  Note: This file is a part of the "Dielectric resonator design and 
%        analysis utility" (DRA.m).
%
%  Programming: Alexandre Perron (perrona@emt.inrs.ca)               
%  Affiliation: Institut national de la recherche scientifique (INRS)  
%  Last modification: July 31st, 2008                              
%--------------------------------------------------------------------------

function dRec_en

% Header:
clc
disp(strvcat('===============================================================',...
             '       Dielectric resonator design and analysis utility        ',...
             '==============================================================='));
disp(sprintf('\n---------------- Rectangular resonator design -----------------'));

% Input of the design parameters:
freq = [];
while isempty(freq)||(isnumeric(freq) == 0)
   freq = input('\nInput the desired resonant frequency (GHz): ');
end

mode_choice = [];
while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3)
    mode_choice = input(['\nFor which mode?\n',...
                        '   (1) TE(x)d11 mode\n', ...
                        '   (2) TE(y)1d1 mode\n', ...
                        '   (3) TE(z)11d mode (isolated resonator)\n', ...
                        'Make your choice: ']);
end

BW = [];
while isempty(BW)||(isnumeric(BW) == 0)
   BW = input('\nInput the minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
end

VSWR = [];
while isempty(VSWR)||(isnumeric(VSWR) == 0)
    VSWR = input('\nInput the VSWR for the impedance bandwidth calculations (e.g.: 2): ');
end

er = [];
while isempty(er)||(isnumeric(er) == 0)
    er = input('\nInput the dielectric constant of the available material: ');
end

ratio = [];
while isempty(ratio)||(isnumeric(ratio) == 0)
    ratio = input('\nInput the desired ''width/height'' (w/h) ratio \nor ''0'' if you do not want to specify it: ');
end

% The ratio is ajusted to w/(2*h), to take into account the image effect:
ratio = ratio/2;
    
ratio2 = [];
while isempty(ratio2)||(isnumeric(ratio2) == 0)
    ratio2 = input('\nInput the desired ''depth/height'' (d/h) ratio \nor ''0'' if you do not want to specify it: ');
end

% The ratio is ajusted to d/(2*h), to take into account the image effect:
ratio2 = ratio2/2;

repeat = 1;
define_ratio_span = 1;
define_ratio2_span = 1;
while (repeat == 1)
    % Maximum Q-factor for the minimum bandwidth and VSWR:
    maxQfactor = (VSWR-1)/(sqrt(VSWR)*BW);
    Qfactor = [];
    % k0 calculation from the desired resonant frequency:
    k0 = 2*pi*freq*1e7/299792458;
    % If the ratios are specified by the user, we must verify that the
    % minimum bandwidth can be achieved for the desired mode:
    if (ratio ~= 0 && ratio2 ~= 0)
        switch mode_choice
            case 1
                for n = 0:0.0001:Inf
                    ky = pi*ratio2/ratio/n;
                    kz = pi*ratio2/n;
                    kx = sqrt(er*k0^2-ky^2-kz^2);
                    y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                    if (y > 0) 
                        d = n;
                        break 
                    end
                end
                b = d/ratio2;
                h = b/2;
                w = b*ratio;
                ky = pi/w;
                kz = pi/b;
                kx = sqrt(er*k0^2-ky^2-kz^2);
                We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                k0 = sqrt((kx^2+ky^2+kz^2)/er);
                Prad = 10*k0^4*norm(pm)^2;
                Qfactor = 4*pi*freq*1e7*We/Prad;
            case 2
                for n = 0:0.0001:Inf
                    kx = pi*ratio/ratio2/n;
                    kz = pi*ratio/n;
                    ky = sqrt(er*k0^2-kx^2-kz^2);
                    y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                    if (y > 0) 
                        w = n;
                        break 
                    end
                end
                b = w/ratio;
                h = b/2;
                d = b*ratio2;
                kx = pi/d;
                kz = pi/b;
                ky = sqrt(er*k0^2-kx^2-kz^2);
                We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                k0 = sqrt((kx^2+ky^2+kz^2)/er);
                Prad = 10*k0^4*norm(pm)^2;
                Qfactor = 4*pi*freq*1e7*We/Prad;
            case 3
                for n = 0:0.0001:Inf
                    kx = pi/ratio2/n;
                    ky = pi/ratio/n;
                    kz = sqrt(er*k0^2-kx^2-ky^2);
                    y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                    if (y > 0) 
                        b = n;
                        break 
                    end
                end
                h = b/2;
                d = ratio2*b;
                w = ratio*b;
                kx = pi/d;
                ky = pi/w;
                kz = sqrt(er*k0^2-kx^2-ky^2);
                We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                k0 = sqrt((kx^2+ky^2+kz^2)/er);
                Prad = 10*k0^4*norm(pm)^2;
                Qfactor = 4*pi*freq*1e7*We/Prad;       
        end
        
        % If it is not possible, the user must change at least one design parameter:
        if (maxQfactor < Qfactor)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5 && choice ~= 6)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'specified dielectric constant and ratios. Do you wish to:\n', ...
                               '   (1) Modify the ''width/height'' (w/h) ratio (or omit specifying one)?\n', ...
                               '   (2) Modify the ''depth/height'' (d/h) ratio (or omit specifying one)?\n', ...
                               '   (3) Modify the dielectric constant of the resonator?\n', ...
                               '   (4) Modify the minimum impedance bandwidth?\n', ...
                               '   (5) Select another mode?\n', ...
                               '   (6) Return to the main menu?\n', ...                               
                               'Make your choice: ']);
            end

            switch choice
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nInput the new ''width/height'' (w/h) ratio\nor ''0'' if you do not want to specify it: ');
                    end
                    if(ratio == 0)
                        define_ratio_span = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)
                        ratio2 = input('\nInput the new ''depth/height'' (a/h) ratio\nor ''0'' if you do not want to specify it: ');
                    end
                    if(ratio2 == 0)
                        define_ratio2_span = 1;
                    end
                case 3
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 4
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 5 
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE(x)d11 mode\n', ...
                                            '   (2) TE(y)1d1 mode\n', ...
                                            '   (3) TE(z)11d mode (isolated resonator)\n', ...
                                            'Make your choice: ']);
                    end
                case 6     
                    return
            end    
        
        % If all parameters are correct, the actual bandwidth of the resonator is calculated:
        else
            actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
            repeat = 0;
        end
             
    elseif(ratio ~= 0 && ratio2 == 0)
        
        if(define_ratio2_span == 1)
            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min < 0)
                ratio2_min = input('\nInput the minimum ''depth/height'' (d/w) ratio to study: ');
            end
            % Ground plane effect:
            ratio2_min = ratio2_min/2;
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)
                ratio2_max = input('\nInput the maximum ''depth/height'' (d/w) ratio to study: ');
            end
            % Ground plane effect:
            ratio2_max = ratio2_max/2;
            
            number = [];
            while isempty(number)||(isnumeric(number) == 0)||(number < 2)
                number = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio2_span = 0;
            step = (ratio2_max - ratio2_min)/(number-1);
            results = [];
            row = 1;
        end    

        % For each value of k (of ratio d/(2*h)), the Q-factor is calculated:
        for k = ratio2_min:step:ratio2_max
            switch mode_choice
                case 1
                    for n = 0:0.0001:Inf
                        ky = pi*k/ratio/n;
                        kz = pi*k/n;
                        kx = sqrt(er*k0^2-ky^2-kz^2);
                        y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                        if (y > 0) 
                            d = n;
                            break 
                        end
                    end
                    b = d/k;
                    h = b/2;
                    w = b*ratio;
                    ky = pi/w;
                    kz = pi/b;
                    kx = sqrt(er*k0^2-ky^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    Qfactor = 4*pi*freq*1e7*We/Prad;
                case 2
                    for n = 0:0.0001:Inf
                        kx = pi*ratio/k/n;
                        kz = pi*ratio/n;
                        ky = sqrt(er*k0^2-kx^2-kz^2);
                        y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                        if (y > 0) 
                            w = n;
                            break 
                        end
                    end
                    b = w/ratio;
                    h = b/2;
                    d = b*k;
                    kx = pi/d;
                    kz = pi/b;
                    ky = sqrt(er*k0^2-kx^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    Qfactor = 4*pi*freq*1e7*We/Prad;
                case 3
                    for n = 0:0.0001:Inf
                        kx = pi/k/n;
                        ky = pi/ratio/n;
                        kz = sqrt(er*k0^2-kx^2-ky^2);
                        y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                        if (y > 0) 
                            b = n;
                            break 
                        end
                    end
                    h = b/2;
                    d = k*b;
                    w = ratio*b;
                    kx = pi/d;
                    ky = pi/w;
                    kz = sqrt(er*k0^2-kx^2-ky^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    Qfactor = 4*pi*freq*1e7*We/Prad;       
            end
            
            % If the calculated Q-factor meets the minimum specifications, the dimensions
            % of the resonator and calculated bandwidth are stored into matrix 'results':
            if (maxQfactor > Qfactor)
                actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
                results(row,:) = [k*2 w d h Qfactor actualBW]; 
                row = row+1;
            end    
        end

        % If the minimum bandwidth cannot be achieved for any value of 'k',
        % the user must change at least one design parameter:
        if(row == 1)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'current ''dielectric constant/ratio limits'' combination. Do you wish to:\n', ...
                               '   (1) Modify the ''depth/height'' (d/h) ratio limits (or specify a single ratio)?\n', ...
                               '   (2) Modify the dielectric constant of the resonator?\n', ...
                               '   (3) Modify the minimum impedance bandwidth?\n', ...
                               '   (4) Select another mode?\n', ...
                               '   (5) Return to the main menu?\n', ...                               
                               'Make your choice: ']);
            end
            
            switch choice
                case 1
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)
                        ratio2 = input('\nInput the new ''depth/height'' (d/h) ratio\nor ''0'' if you do not want to specify it: ');
                    end
                    % Ground plane effect:
                    ratio2 = ratio2/2;
                    if(ratio2 == 0)
                        define_ratio2_span = 1;
                    end    
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 4
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE(x)d11 mode\n', ...
                                            '   (2) TE(y)1d1 mode\n', ...
                                            '   (3) TE(z)11d mode (isolated resonator)\n', ...
                                            'Make your choice: ']);
                    end
                case 5    
                    return
            end
            
        else
            repeat = 0;
        end

    elseif(ratio == 0 && ratio2 ~= 0)
        
        if(define_ratio_span == 1)
            ratio_min = [];
            while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min == 0)
                ratio_min = input('\nInput the minimum ''width/height'' (w/h) ratio to study: ');
            end
            % Ground plane effect:
            ratio_min = ratio_min/2;
            
            ratio_max = [];
            while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)
                ratio_max = input('\nInput the maximum ''width/height'' (w/h) to study: ');
            end
            % Ground plane effect:
            ratio_max = ratio_max/2;
            
            number = [];
            while isempty(number)||(isnumeric(number) == 0)||(number < 2)
                number = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio_span = 0;
            step = (ratio_max-ratio_min)/(number-1);
            results = [];
            row = 1;
        end

        % For each value of k (of ratio w/(2*h)), the Q-factor is calculated:
        for k = ratio_min:step:ratio_max
            switch mode_choice
                case 1
                    for n = 0:0.0001:Inf
                        ky = pi*ratio2/k/n;
                        kz = pi*ratio2/n;
                        kx = sqrt(er*k0^2-ky^2-kz^2);
                        y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                        if (y > 0) 
                            d = n;
                            break 
                        end
                    end
                    b = d/ratio2;
                    h = b/2;
                    w = b*k;
                    ky = pi/w;
                    kz = pi/b;
                    kx = sqrt(er*k0^2-ky^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    Qfactor = 4*pi*freq*1e7*We/Prad;
                case 2
                    for n = 0:0.0001:Inf
                        kx = pi*k/ratio2/n;
                        kz = pi*k/n;
                        ky = sqrt(er*k0^2-kx^2-kz^2);
                        y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                        if (y > 0) 
                            w = n;
                            break 
                        end
                    end
                    b = w/k;
                    h = b/2;
                    d = b*ratio2;
                    kx = pi/d;
                    kz = pi/b;
                    ky = sqrt(er*k0^2-kx^2-kz^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    Qfactor = 4*pi*freq*1e7*We/Prad;
                case 3
                    for n = 0:0.0001:Inf
                        kx = pi/ratio2/n;
                        ky = pi/k/n;
                        kz = sqrt(er*k0^2-kx^2-ky^2);
                        y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                        if (y > 0) 
                            b = n;
                            break 
                        end
                    end
                    h = b/2;
                    d = ratio2*b;
                    w = k*b;
                    kx = pi/d;
                    ky = pi/w;
                    kz = sqrt(er*k0^2-kx^2-ky^2);
                    We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                    pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                    k0 = sqrt((kx^2+ky^2+kz^2)/er);
                    Prad = 10*k0^4*norm(pm)^2;
                    Qfactor = 4*pi*freq*1e7*We/Prad;       
            end
            
            % If the calculated Q-factor meets the minimum specifications, the dimensions
            % of the resonator and calculated bandwidth are stored into matrix 'results':
            if (maxQfactor > Qfactor)
                actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
                results(row,:) = [k*2 w d h Qfactor actualBW]; 
                row = row+1;
            end    
        end
  
        % If the minimum bandwidth cannot be achieved for any value of 'k',
        % the user must change at least one design parameter:
        if(row == 1)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                               'current ''dielectric constant/ratio limits'' combination. Do you wish to:\n', ...
                               '   (1) Modify the ''width/height'' (w/h) ratio limits (or specify a single ratio)?\n', ...
                               '   (2) Modify the dielectric constant of the resonator?\n', ...
                               '   (3) Modify the minimum impedance bandwidth?\n', ...
                               '   (4) Select another mode?\n', ...
                               '   (5) Return to the main menu?\n', ...                               
                               'Make your choice: ']);
            end
            
            switch choice
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nInput the new ''width/height'' (w/h) ratio\nor ''0'' if you do not want to specify it: ');
                    end
                    % Ground plane effect:
                    ratio = ratio/2;
                    if(ratio == 0)
                        define_ratio_span = 1;
                    end    
                case 2
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 3
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 4
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE(x)d11 mode\n', ...
                                            '   (2) TE(y)1d1 mode\n', ...
                                            '   (3) TE(z)11d mode (isolated resonator)\n', ...
                                            'Make your choice: ']);
                    end
                case 5    
                    return
            end
            
        else
            repeat = 0;
        end
        
    else
        if(define_ratio_span == 1)

            ratio_min = [];
            while isempty(ratio_min)||(isnumeric(ratio_min) == 0)||(ratio_min <= 0)
                ratio_min = input('\nInput the minimum ''width/height'' (w/h) ratio to study: ');
            end
            % Ground plane effect:
            ratio_min = ratio_min/2;
        
            ratio_max = [];
            while isempty(ratio_max)||(isnumeric(ratio_max) == 0)||(ratio_max <= ratio_min)
                ratio_max = input('\nInput the maximum ''width/height'' (w/h) ratio to study: ');
            end
            % Ground plane effect:
            ratio_max = ratio_max/2;
                    
            number = [];
            while isempty(number)||(isnumeric(number) == 0)||(number < 2)
                number = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio_span = 0;
            step = (ratio_max-ratio_min)/(number-1);
            results = [];
            row = 1;
        end
        
        if(define_ratio2_span == 1)

            ratio2_min = [];
            while isempty(ratio2_min)||(isnumeric(ratio2_min) == 0)||(ratio2_min <= 0)
                ratio2_min = input('\nInput the minimum ''depth/height'' (d/h) ratio to study: ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio2_min = ratio2_min/2;
        
            ratio2_max = [];
            while isempty(ratio2_max)||(isnumeric(ratio2_max) == 0)||(ratio2_max <= ratio2_min)
                ratio2_max = input('\nInput the maximum ''depth/height'' (d/h) ratio to study: ');
            end
            % Pour tenir compte de l'effet du plan de masse :
            ratio2_max = ratio2_max/2;
            
            number2 = [];
            while isempty(number2)||(isnumeric(number2) == 0)||(number2 < 2)
                number2 = input('\nIncluding these limits, input the number of ratios to study: ');
            end
        
            define_ratio2_span = 0;      
            step2 = (ratio2_max - ratio2_min)/(number2-1);
            results = [];
            row = 1;
        end

        % For each combination of k and l (of ratios w/(2*h) and d/(2*h)), the Q-factor is calculated:
        for k = ratio_min:step:ratio_max
            for l = ratio2_min:step2:ratio2_max 
                switch mode_choice
                    case 1
                        for n = 0:0.0001:Inf
                            ky = pi*l/k/n;
                            kz = pi*l/n;
                            kx = sqrt(er*k0^2-ky^2-kz^2);
                            y = real(kx*tan(kx*n/2)-sqrt((er-1)*k0^2-kx^2));
                            if (y > 0) 
                                d = n;
                                break 
                            end
                        end
                        b = d/l;
                        h = b/2;
                        w = b*k;
                        ky = pi/w;
                        kz = pi/b;
                        kx = sqrt(er*k0^2-ky^2-kz^2);
                        We = 8.854e-12*er*w*2*h*d/32*(1+sin(kx*d)/kx/d)*(ky^2+kz^2);
                        pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kx*d/2);
                        k0 = sqrt((kx^2+ky^2+kz^2)/er);
                        Prad = 10*k0^4*norm(pm)^2;
                        Qfactor = 4*pi*freq*1e7*We/Prad;
                    case 2
                        for n = 0:0.0001:Inf
                            kx = pi*k/l/n;
                            kz = pi*k/n;
                            ky = sqrt(er*k0^2-kx^2-kz^2);
                            y = real(ky*tan(ky*n/2)-sqrt((er-1)*k0^2-ky^2));
                            if (y > 0) 
                                w = n;
                                break 
                            end
                        end
                        b = w/k;
                        h = b/2;
                        d = b*l;
                        kx = pi/d;
                        kz = pi/b;
                        ky = sqrt(er*k0^2-kx^2-kz^2);
                        We = 8.854e-12*er*w*2*h*d/32*(1+sin(ky*w)/ky/w)*(kx^2+kz^2);
                        pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(ky*w/2);
                        k0 = sqrt((kx^2+ky^2+kz^2)/er);
                        Prad = 10*k0^4*norm(pm)^2;
                        Qfactor = 4*pi*freq*1e7*We/Prad;
                    case 3
                        for n = 0:0.0001:Inf
                            kx = pi/l/n;
                            ky = pi/k/n;
                            kz = sqrt(er*k0^2-kx^2-ky^2);
                            y = real(kz*tan(kz*n/2)-sqrt((er-1)*k0^2-kz^2));
                            if (y > 0) 
                                b = n;
                                break 
                            end
                        end
                        h = b/2;
                        d = l*b;
                        w = k*b;
                        kx = pi/d;
                        ky = pi/w;
                        kz = sqrt(er*k0^2-kx^2-ky^2);
                        We = 8.854e-12*er*w*2*h*d/32*(1+sin(kz*2*h)/kz/2/h)*(kx^2+ky^2);
                        pm = -i*2*pi*freq*1e7*8*8.854e-12*(er-1)/kx/ky/kz*sin(kz*h);
                        k0 = sqrt((kx^2+ky^2+kz^2)/er);
                        Prad = 10*k0^4*norm(pm)^2;
                        Qfactor = 4*pi*freq*1e7*We/Prad;       
                end
            
            % If the calculated Q-factor meets the minimum specifications, the dimensions
            % of the resonator and calculated bandwidth are stored into matrix 'results':
                if (maxQfactor > Qfactor)
                    actualBW = (VSWR-1)/(sqrt(VSWR)*Qfactor)*100;
                    results(row,:) = [k*2 l*2 w d h Qfactor actualBW]; 
                    row = row+1;
                end    
            end
        end

        % If the minimum bandwidth cannot be achieved for any combination of k and l,
        % the user must change at least one design parameter:
        if(row == 1)
            clc
            choice = [];
            while isempty(choice)||(choice ~= 1 && choice ~= 2 && choice ~= 3 && choice ~= 4 && choice ~= 5 && choice ~= 6)
                choice = input(['\nThe desired bandwidth cannot be achieved for this mode with the\n',...
                                'current ''dielectric constant/ratio limits'' combination. Do you wish to:\n', ...
                                '   (1) Modify the ''width/height'' (w/h) ratio limits (or specify a single ratio)?\n', ...
                                '   (2) Modify the ''depth/height'' (d/h) ratio limits (or specify a single ratio)?\n', ...
                                '   (3) Modify the dielectric constant of the resonator?\n', ...
                                '   (4) Modify the minimum impedance bandwidth?\n', ...
                                '   (5) Select another mode?\n', ...
                                '   (6) Return to the main menu?\n', ...                               
                                'Make your choice: ']);
            end
            
            switch choice
                case 1
                    ratio = [];
                    while isempty(ratio)||(isnumeric(ratio) == 0)
                        ratio = input('\nInput the new ''width/height'' (w/h) ratio\nor ''0'' if you do not want to specify it: ');
                    end
                    % Ground plane effect:
                    ratio = ratio/2;
                    if(ratio == 0)
                        define_ratio_span = 1;
                    end
                case 2
                    ratio2 = [];
                    while isempty(ratio2)||(isnumeric(ratio2) == 0)
                        ratio2 = input('\nInput the new ''depth/height'' (d/h) ratio\nor ''0'' if you do not want to specify it: ');
                    end
                    % Ground plane effect:
                    ratio2 = ratio2/2;
                    if(ratio2 == 0)
                        define_ratio2_span = 1;
                    end
                case 3
                    er = [];
                    while isempty(er)||(isnumeric(er) == 0)
                        er = input('\nInput the new dielectric constant of the resonator: ');
                    end
                case 4
                    BW = [];
                    while isempty(BW)||(isnumeric(BW) == 0)
                        BW = input('\nInput the new minimum fractional bandwidth (e.g.: 0.05 for 5%): ');
                    end
                case 5
                    mode_choice = [];
                    while isempty(mode_choice)||(mode_choice ~= 1 && mode_choice ~= 2 && mode_choice ~= 3)
                        mode_choice = input(['\nFor which mode?\n',...
                                            '   (1) TE(x)d11 mode\n', ...
                                            '   (2) TE(y)1d1 mode\n', ...
                                            '   (3) TE(z)11d (isolated resonator)\n', ...
                                            'Make your choice: ']);
                    end
                case 6    
                    return
            end
            
        else
            repeat = 0;
        end    

    end
    
    if (repeat == 0)
        
        % Header:
        clc
        disp(strvcat('===============================================================',...
                     '       Dielectric resonator design and analysis utility        ',...
                     '==============================================================='));
        disp(sprintf('\n---------------- Rectangular resonator design -----------------\n'));
 
        % Display the input parameters:
        disp(sprintf('Resonant frequency (GHz) = %5.4f',freq));
        switch mode_choice
            case 1
                disp(sprintf('Mode = TE(x)d11'));
            case 2
                disp(sprintf('Mode = TE(y)1d1'));
            case 3
                disp(sprintf('Mode = TE(z)11d'));
        end
        disp(sprintf('Minimum fractional impedance bandwidth = %5.4f',BW));
        disp(sprintf('VSWR for the bandwidth calculations = %5.4f',VSWR));
        disp(sprintf('Dielectric constant of the resonator = %5.4f',er));
        
        % Display the results:
        if (ratio ~= 0 && ratio2 ~= 0)
            disp(sprintf('''Width/height'' (w/h) ratio = %5.4f',ratio*2));
            disp(sprintf('''Depth/height'' (d/h) ratio = %5.4f',ratio2*2));    
            disp(sprintf('\n'));
            disp(strvcat('       Results for the selected mode        ', ...
                         '--------------------------------------------'));
            disp(sprintf('Width (w) of the resonator (cm) = %5.4f',w));
            disp(sprintf('Depth (d) of the resonator (cm) = %5.4f',d));
            disp(sprintf('Height (h) of the resonator (cm) = %5.4f',h));
            disp(sprintf('Q-factor = %5.4f',Qfactor));
            disp(sprintf('Bandwidth (percentage) = %5.4f',actualBW));
            
        elseif (ratio ~= 0 && ratio2 == 0)
            disp(sprintf('\n'));
            disp(sprintf('''Width/height'' (w/h) ratio = %5.4f',ratio*2));
            disp(sprintf('Minimum ''depth/height'' (d/h) ratio = %5.4f',ratio2_min*2));
            disp(sprintf('Maximum ''depth/height'' (d/h) ratio = %5.4f',ratio2_max*2));
            disp(sprintf('Number of ratios to study = %5.4f',number));
            disp(sprintf('\n'));
            disp(strvcat('                    Results for the selected mode                   ', ...                 
                         '--------------------------------------------------------------------'));
            disp('d/h         w           d           h           Q-factor    BW');
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(results,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',results(n,:)));
            end
        elseif (ratio == 0 && ratio2 ~= 0)
            disp(sprintf('\n'));
            disp(sprintf('''Depth/height'' (d/h) ratio = %5.4f',ratio2*2));
            disp(sprintf('Minimum ''width/height'' (w/h) ratio = %5.4f',ratio_min*2));
            disp(sprintf('Maximum ''width/height'' (w/h) ratio = %5.4f',ratio_max*2));
            disp(sprintf('Number of ratios to study = %5.4f',number));
            disp(sprintf('\n'));
            disp(strvcat('                    Results for the selected mode                   ', ...     
                         '--------------------------------------------------------------------'));
            disp('w/h         w           d           h           Q-factor    BW');
            disp('--------------------------------------------------------------------');
            for n = 1:1:size(results,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',results(n,:)));
            end
        else
            disp(sprintf('\n'));
            disp(sprintf('Minimum ''width/height'' (w/h) ratio = %5.4f',ratio_min*2));
            disp(sprintf('Maximum ''width/height'' (w/h) ratio = %5.4f',ratio_max*2));
            disp(sprintf('Number of ratios to study = %5.4f',number));
            disp(sprintf('\n'));
            disp(sprintf('Minimum ''depth/height'' (d/h) ratio = %5.4f',ratio2_min*2));
            disp(sprintf('Maximum ''depth/height'' (d/h) ratio = %5.4f',ratio2_max*2));
            disp(sprintf('Number of ratios to study = %5.4f',number2));
            disp(sprintf('\n'));
            disp(strvcat('                        Results for the selected mode                           ', ...            
                         '--------------------------------------------------------------------------------'));
            disp('w/h         d/h         w           d           h           Q-factor    BW');
            disp('--------------------------------------------------------------------------------');
            for n = 1:1:size(results,1)
                disp(sprintf('%-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g    %-8.4g',results(n,:)));
            end    
        end
    end
end

end