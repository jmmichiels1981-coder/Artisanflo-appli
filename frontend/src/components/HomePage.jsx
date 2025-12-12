import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';
                                    </div >
                                </div >
                            )}
                        </>
                    )}

<div className="login-links">
    <div className="link-row mt-small">
        <Link to="/admin/login" className="text-orange">accès admin</Link>
        <span className="separator">|</span>
        <Link to="/contact" className="text-orange">contact</Link>
        <span className="separator">|</span>
        <Link to="/mentions-legales" className="text-orange">mentions légales</Link>
    </div>
</div>
                </div >
            </main >
        </div >
    );
};

export default HomePage;
